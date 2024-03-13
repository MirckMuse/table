import { runIdleTask } from "@stable/table-shared";
import { ColKey, FilterState, GetRowKey, RowData, RowKey, SorterDirection, SorterState } from "@stable/table-typing";
import { chunk, cloneDeep, get, isNil } from "lodash-es";
import { TableState } from "./table";
import workerpool from "workerpool";

const workerpoolInstance = workerpool.pool()

export interface RowMeta {
  key: RowKey;

  index: number;

  deep: number;

  height: number;

  _sort: string;
}

export type TableRowStateOrNull = TableRowState | null;

export interface TableRowStateOption {
  rowData: RowData;

  meta: RowMeta;

  rowStateCenter: TableRowStateCenter;
}

export class TableRowState {
  rowData: RowData;

  private meta: RowMeta;

  getMeta() {
    return Object.assign({}, this.meta);
  }

  updateMeta(meta: Partial<RowMeta>) {
    Object.assign(this.meta, meta)
  }

  rowStateCenter: TableRowStateCenter;

  constructor(option: TableRowStateOption) {
    this.rowData = option.rowData;
    this.meta = option.meta;
    this.rowStateCenter = option.rowStateCenter;
  }

  updateHeight(height: number) {
    this.updateMeta({ height })
  }
}

export type SorterMemoize = Map<ColKey, Map<SorterDirection, Map<RowKey, Map<RowKey, number>>>>;

export interface TableRowStateCenterOption {
  rowHeight?: number;

  getRowKey?: GetRowKey;

  tableState: TableState;
}

const DefaultRowHeight = 55;

const ChunkSize = 100;

enum CompareResult {
  Less = -1,
  Equal = 0,
  Greater = 1
}

export class TableRowStateCenter {
  // 原始行 keys
  rawRowKeys: RowKey[] = [];

  // 展开行的 key值
  flattenRowKeys: RowKey[] = [];

  // 展示行的 Y 坐标值
  flattenYIndexes: number[] = [];

  // rowKey => TableRowState 映射关系
  private rowStateMap = new Map<RowKey, TableRowState>();

  private rowKeyMap = new WeakMap<RowData, RowKey>;

  // 表格状态
  private tableState: TableState;

  // 近似行高、初始化使用。
  private roughRowHeight: number;

  private getRowKey: GetRowKey;

  constructor(option: TableRowStateCenterOption) {
    this.tableState = option.tableState;
    this.roughRowHeight = option.rowHeight ?? DefaultRowHeight;
    this.getRowKey = option.getRowKey ?? (() => -1);
  }

  // 初始化一些关键属性
  private init() {
    this.rowStateMap.clear();
    this.rawRowKeys = [];
    this.flattenRowKeys = [];
    this.flattenYIndexes = [];
    this.rowKeyMap = new WeakMap<RowData, RowKey>;
  }

  private sorterMemoize: SorterMemoize = new Map();

  // 根据排序状态获取排序结果
  // TODO: 数据有可能会发生更新
  private getSorterMemorize(sorterState: SorterState, prevRowData: RowData, nextRowData: RowData): number {
    const { colKey, direction } = sorterState;

    if (!direction || !colKey) {
      return CompareResult.Equal;
    }

    let map = this.sorterMemoize.get(sorterState.colKey)?.get(direction)

    const prevRowDataKey = this.getRowKeyByRowData(prevRowData);
    const nextRowDataKey = this.getRowKeyByRowData(nextRowData);

    let compareResult = map?.get(prevRowDataKey)?.get(nextRowDataKey)

    if (!isNil(compareResult)) {
      return compareResult;
    }

    // 排序系数
    let rate = 0;
    if (sorterState.direction === SorterDirection.Ascend) {
      rate = 1;
    } else if (sorterState.direction === SorterDirection.Descend) {
      rate = -1;
    }

    compareResult = this.orderBy(sorterState, prevRowData, nextRowData) * rate;

    map = map || new Map<RowKey, Map<RowKey, number>>();
    const childrenMap = map.get(prevRowDataKey) || new Map();
    childrenMap.set(nextRowDataKey, compareResult);
    map.set(prevRowDataKey, childrenMap);

    const cokKeyMap = this.sorterMemoize.get(sorterState.colKey) || new Map();
    cokKeyMap.set(direction, map)
    this.sorterMemoize.set(sorterState.colKey, cokKeyMap);

    return compareResult;
  }


  private sorterStates: SorterState[] = [];

  filterStates: FilterState[] = [];

  // 获取筛选后的行数据
  async getFilteredRowDatas(rowDatas: RowData[]): Promise<RowData[]> {
    if (!this.filterStates?.length) return rowDatas;

    type PoolRow = { key: RowKey, data: RowData };

    function _poolTask(rows: PoolRow[], filterStates: FilterState[]): RowKey[] {
      return filterStates
        .reduce<PoolRow[]>((filteredRows, filterState) => {
          const { filterKeys, dataIndex } = filterState as any;

          if (filterKeys?.length) {
            return filteredRows.filter((row) => {
              return filterKeys.some((key: string) => row.data[dataIndex] === key)
            })
          }

          return filteredRows;
        }, rows)
        .map((row: PoolRow) => row.key);
    }

    const _task = (rows: RowData[]) => {
      const poolRows = rows.map(row => {
        return {
          key: this.getRowKeyByRowData(row),
          data: cloneDeep(row)
        }
      });

      return workerpoolInstance.exec(_poolTask, [
        poolRows,
        cloneDeep(this.filterStates).map(state => Object.assign({}, state, { dataIndex: this.tableState.colStateCenter.getColumnByColKey(state.colKey)?.dataIndex }))
      ])
    }

    const chunks = chunk(rowDatas, ChunkSize);

    return Promise
      .all(chunks.map(rows => _task(rows)))
      .then((rowKeyChunks) => {
        return rowKeyChunks.flat().reduce<RowData[]>((result, key) => {
          const rowData = this.getRowDataByRowKey(key)
          if (rowData) {
            result.push(rowData);
          }
          return result;
        }, [])
      })
      .finally(() => {
        workerpoolInstance.terminate();
      })
  }

  //  获取排序后的行数据
  getSortedRowDatas(rowDatas: RowData[]): RowData[] {
    return rowDatas
      .sort((prev, next) => {
        for (const state of this.sorterStates) {
          const compareResult = this.getSorterMemorize(state, prev, next);

          if (compareResult === CompareResult.Equal) {
            continue;
          }

          return compareResult;
        }

        return CompareResult.Equal;
      });
  }

  private orderBy(sorterState: SorterState, prevRowData: RowData, nextRowData: RowData): number {
    const column = this.tableState.colStateCenter.getColumnByColKey(sorterState.colKey);

    if (!column || !column.dataIndex) return CompareResult.Equal;

    const prevRowDataValue = get(prevRowData, column.dataIndex);
    const nextRowDataValue = get(nextRowData, column.dataIndex);

    // 空之间的相互对比
    if (isNil(prevRowDataValue) && isNil(nextRowDataValue)) return CompareResult.Equal;
    if (isNil(prevRowDataValue) && !isNil(nextRowDataValue)) return CompareResult.Greater;
    if (!isNil(prevRowDataValue) && isNil(nextRowDataValue)) return CompareResult.Less;

    if (prevRowDataValue === nextRowDataValue) return CompareResult.Equal;

    // number string 之间的相互对比
    if (typeof prevRowDataValue === "number" && typeof nextRowDataValue === "number") return prevRowDataValue - nextRowDataValue;
    if (typeof prevRowDataValue === "string" && typeof nextRowDataValue === "string") return prevRowDataValue > nextRowDataValue ? CompareResult.Greater : CompareResult.Less;
    if (typeof prevRowDataValue === "number" && typeof nextRowData === "string") return CompareResult.Greater;
    if (typeof prevRowDataValue === "string" && typeof nextRowData === "number") return CompareResult.Less;

    // 其他之间的数据类型对比，则直接判定为相等。
    return CompareResult.Equal;
  }

  // 更新行数据
  updateRowDatas(rowDatas: RowData[]) {
    this.init();

    // 粗略估计一下可视高度
    this.tableState.viewport.scrollHeight = rowDatas.length * this.roughRowHeight;
    this.flattenYIndexes = Array(rowDatas.length).fill(null).map((_, i) => (i + 1) * this.roughRowHeight);


    // 生成行数据的 meta
    const _createRowStateMeta = (rowData: RowData, index: number): RowMeta => {
      return {
        key: this.getRowKey ? this.getRowKey(rowData) : `0-${index}`,
        index,
        deep: 0,
        height: this.roughRowHeight,
        _sort: index.toString(),
      }
    }

    // 生成行数据的状态
    const _createRowState = (rowData: RowData, index: number) => {
      const meta = _createRowStateMeta(rowData, index);

      return new TableRowState({
        rowData: rowData,
        meta,
        rowStateCenter: this,
      });
    }

    const _task = (oneChunk: RowData[], chunkIndex: number) => {
      oneChunk.forEach((rowData, index) => {
        const state = _createRowState(rowData, index + chunkIndex * ChunkSize);

        const rowKey = state.getMeta().key;
        this.rawRowKeys.push(rowKey);
        this.rowStateMap.set(rowKey, state);
        this.flattenRowKeys.push(rowKey);
        this.rowKeyMap.set(rowData, rowKey);
      })
    }

    const chunks = chunk(rowDatas, ChunkSize);

    _task(chunks[0], 0);
    for (let i = 1; i < chunks.length; i++) {
      runIdleTask(() => _task(chunks[i], i));
    }
  }

  getStateByRowData(rowData: RowData): TableRowStateOrNull {
    const rowKey = this.rowKeyMap.get(rowData);

    if (isNil(rowKey)) return null;

    return this.getStateByRowKey(rowKey);
  }

  getStateByRowKey(rowKey: RowKey): TableRowStateOrNull {
    return this.rowStateMap.get(rowKey) ?? null;
  }

  getRowKeyByRowData(rowData: RowData): RowKey {
    return this.rowKeyMap.get(rowData) ?? -1;
  }

  getStateByFlattenIndex(index: number): TableRowStateOrNull {
    const rowKey = this.flattenRowKeys[index];

    if (isNil(rowKey)) return null;

    return this.getStateByRowKey(rowKey);
  }

  getRowHeight(state?: TableRowStateOrNull): number {
    return state?.getMeta().height ?? this.roughRowHeight;
  }

  getRowHeightByRowKey(rowKey: RowKey): number {
    return this.getRowHeight(this.getStateByRowKey(rowKey));
  }

  getRowHeightByRowData(rowData: RowData): number {
    const rowKey = this.getStateByRowData(rowData)?.getMeta().key;

    if (isNil(rowKey)) return 0;

    return this.getRowHeightByRowKey(rowKey);
  }

  getRowHeightByFlattenIndex(index: number): number {
    const rowKey = this.flattenRowKeys[index];

    if (isNil(rowKey)) return this.roughRowHeight;

    return this.getRowHeightByRowKey(rowKey);
  }

  getRowDataByRowKey(rowKey: RowKey): RowData | null {
    return this.getStateByRowKey(rowKey)?.rowData ?? null
  }

  getRowDataByFlattenIndex(index: number): RowData | null {
    const rowKey = this.flattenRowKeys[index]

    if (isNil(rowKey)) return null;

    return this.getRowDataByRowKey(rowKey);
  }

  insertRowState(rowData: RowData, meta: Partial<RowMeta>): TableRowState {
    const rowKey = this.getRowKey ? this.getRowKey(rowData) : `${meta.deep}-${meta.index}`;

    const newMeta = Object.assign({}, {
      key: rowKey,
      height: this.roughRowHeight,
    }, meta) as RowMeta;

    const state = new TableRowState({
      rowData,
      meta: newMeta,
      rowStateCenter: this,
    });

    this.rowStateMap.set(rowKey, state);
    this.rowKeyMap.set(rowData, rowKey);

    return state;
  }

  updateYIndexesByRowKey(rowKey?: RowKey) {
    if (!rowKey) {
      this.updateYIndexesByFlattenIndex();
      return;
    }

    const rowIndex = this.getStateByRowKey(rowKey)?.getMeta().index ?? -1;

    const matchIndex = rowIndex < (this.flattenRowKeys.length / 2)
      ? this.flattenRowKeys.findIndex(_rowKey => _rowKey === rowKey)
      : this.flattenRowKeys.findLastIndex(_rowKey => _rowKey === rowKey);

    this.updateYIndexesByFlattenIndex(matchIndex)
  }

  updateYIndexesByFlattenIndex(index = 0) {
    const flattenIndex = Math.max(index, 0);
    let reduceHeight = this.flattenYIndexes[flattenIndex - 1] || 0;
    const length = this.flattenYIndexes.length;

    for (let i = flattenIndex; i < length - 1; i++) {
      this.flattenYIndexes[i] = reduceHeight + this.getRowHeightByFlattenIndex(i);
      reduceHeight = this.flattenYIndexes[i];
    }
  }
}
