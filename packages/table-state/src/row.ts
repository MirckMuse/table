import { runIdleTask } from "@scode/table-shared";
import {
  ColKey,
  FilterState,
  GetRowKey,
  RowData,
  RowKey,
  SorterDirection,
  SorterState,
  TableColumnFilter,
} from "@scode/table-typing";
import { chunk, get, isNil } from "lodash-es";
import { TableState } from "./table";
import { toRaw } from "vue";

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
    Object.assign(this.meta, meta);
  }

  rowStateCenter: TableRowStateCenter;

  constructor(option: TableRowStateOption) {
    this.rowData = option.rowData;
    this.meta = option.meta;
    this.rowStateCenter = option.rowStateCenter;
  }

  updateHeight(height: number) {
    this.updateMeta({ height });
  }
}

export type SorterMemoize = Map<
  ColKey,
  Map<SorterDirection, Map<RowKey, Map<RowKey, number>>>
>;

export interface TableRowStateCenterOption {
  rowHeight: number;

  getRowKey?: GetRowKey;

  tableState: TableState;
}

const ChunkSize = 100;

enum CompareResult {
  Less = -1,
  Equal = 0,
  Greater = 1,
}

// FIXME: 目前行控制器的功能太重了，需要精简，
// FIXME: 精简目标：只负责维护的元数据
export class TableRowStateCenter {
  // 原始行 keys
  rawRowKeys: RowKey[] = [];

  // 筛选后的 keys, 根据 rawRowKeys 得来的。
  filteredRowKeys: RowKey[] = [];

  // 排序后的 keys，根据 filteredRowKeys 得来的。
  sorteredRowKeys: RowKey[] = [];

  // 展开行的 key值, 根据 sorteredRowKeys 计算得来的，包含展开数据
  flattenRowKeys: RowKey[] = [];

  // 展示行的 Y 坐标值
  flattenYIndexes: number[] = [];

  // rowKey => TableRowState 映射关系
  private rowStateMap = new Map<RowKey, TableRowState>();

  private rowKeyMap = new WeakMap<RowData, RowKey>();

  // 表格状态
  private tableState: TableState;

  // 近似行高、初始化使用。
  private roughRowHeight: number;

  get rowHeight() {
    return this.roughRowHeight;
  }

  private getRowKey: GetRowKey;

  constructor(option: TableRowStateCenterOption) {
    this.tableState = option.tableState;
    this.roughRowHeight = option.rowHeight;
    this.getRowKey = option.getRowKey ?? (() => -1);
  }

  // 初始化一些关键属性
  private init() {
    this.rowStateMap.clear();
    this.rawRowKeys = [];
    this.filteredRowKeys = [];
    this.sorteredRowKeys = [];
    this.flattenRowKeys = [];
    this.flattenYIndexes = [];
    this.rowKeyMap = new WeakMap<RowData, RowKey>();
  }

  private sorterMemoize: SorterMemoize = new Map();

  // TODO: RowData 改变后，需要重置 memoize，大概 2n - 2 次操作
  updateSorterMemoizeByRowDataChange() {
  }

  // 根据排序状态获取排序结果
  // TODO: 数据有可能会发生更新
  private getSorterMemorize(
    sorterState: SorterState,
    prevRowData: RowData,
    nextRowData: RowData,
  ): number {
    const { colKey, direction } = sorterState;

    if (!direction || !colKey) {
      return CompareResult.Equal;
    }

    let map = this.sorterMemoize.get(sorterState.colKey)?.get(direction);

    const prevRowDataKey = this.getRowKeyByRowData(prevRowData);
    const nextRowDataKey = this.getRowKeyByRowData(nextRowData);

    let compareResult = map?.get(prevRowDataKey)?.get(nextRowDataKey);

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
    cokKeyMap.set(direction, map);
    this.sorterMemoize.set(sorterState.colKey, cokKeyMap);

    return compareResult;
  }

  sorterStates: SorterState[] = [];

  filterStates: FilterState[] = [];

  // 更新排序状态
  updateSorterStates(sorterStates: SorterState[]) {
    if (!sorterStates.length) {
      this.flattenRowKeys = Array.from(toRaw(this.rawRowKeys));
      this.sorterStates = [];
      return;
    };

    // 判断是否为固定高度的表格。
    const isFixedRowHeight = this.tableState.isFixedRowHeight;

    this.sorterStates = sorterStates;

    let height = 0;
    let flattenYIndexes: number[] = [];

    const flattenRowKeysSet = new Set(this.flattenRowKeys);

    this.flattenRowKeys = this
      .getSortedRowDatas(this.rawRowKeys.filter(rowKey => flattenRowKeysSet.has(rowKey)).reduce<RowData[]>((rowDatas, rowKey) => {
        const rowData = this.getRowDataByRowKey(rowKey);

        if (rowData) {
          rowDatas.push(rowData);
        }

        if (!isFixedRowHeight) {
          const rowMeta = this.getStateByRowKey(rowKey)?.getMeta();
          flattenYIndexes.push(height);
          height = height + (rowMeta?.height ?? 0);
        }

        return rowDatas;
      }, []))
      .map(rowData => this.getRowKeyByRowData(rowData));

    // 固定高度直接算。
    this.flattenYIndexes = isFixedRowHeight
      ? Array(this.flattenRowKeys.length).fill(null).map((_, index) => (index + 1) * this.roughRowHeight)
      : flattenYIndexes;
  }

  //  获取排序后的行数据
  getSortedRowDatas(rowDatas: RowData[]): RowData[] {
    return rowDatas.sort((prev, next) => {
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

  private getRowDatasByRowKeys(rowKeys: RowKey[]) {
    return rowKeys.reduce<RowData[]>((rowDatas, rowKey) => {
      const rowData = this.getRowDataByRowKey(rowKey);

      if (rowData) {
        rowDatas.push(rowData);
      }
      return rowDatas;
    }, []);

    // return rowKeys.map(rowKey => this.getRowDataByRowKey(rowKey)).filter(rowData => rowData) as RowData[]
  }

  // 更新筛选状态
  updateFilterStates(filterStates: FilterState[]) {
    this.filterStates = filterStates;

    let height = 0;
    let flattenYIndexes: number[] = [];

    // 筛选回调函数
    const _filterCallback = (rowData: RowData) => {
      const rowMeta = this.getStateByRowData(rowData)?.getMeta();
      flattenYIndexes.push(height);
      height = height + (rowMeta?.height ?? 0);
    }

    const _rowDatas = this.getRowDatasByRowKeys(this.rawRowKeys);

    this.flattenRowKeys = this
      .getFilteredRowDatas(_rowDatas, _filterCallback)
      .map(rowData => this.getRowKeyByRowData(rowData));

    this.flattenYIndexes = flattenYIndexes;

    this.updateSorterStates(this.sorterStates);
  }

  // 获取筛选后的行数据
  getFilteredRowDatas(rowDatas: RowData[], callback?: (rowData: RowData) => void): RowData[] {
    if (!this.filterStates?.length) {

      if (callback) {
        return rowDatas.map(row => {
          callback(row);
          return row;
        })
      }
      return rowDatas;
    }

    type FilterStateWithConfig = FilterState & { filter: TableColumnFilter };

    function _filterTask(rows: RowData[], filterStates: FilterStateWithConfig[]): RowData[] {

      return rows.filter((rowData) => {

        const isFilter = filterStates.every((filterState) => {
          const { filterKeys, filter } = filterState;

          const onFilter = filter.onFilter!;

          if (filterKeys?.length) {
            return filterKeys.some((key) => onFilter(String(key), toRaw(rowData)));
          }

          return true;
        });

        if (callback && isFilter) {
          callback?.(rowData);
        }

        return isFilter;
      });

      // TODO: 验证是不是通过行筛选更快
      // return filterStates
      //   .reduce<RowData[]>((filteredRows, filterState) => {
      //     const { filterKeys, filter } = filterState;

      //     const onFilter = filter.onFilter!;

      //     if (filterKeys?.length) {
      //       return filteredRows.filter((row) => filterKeys.some((key) => onFilter(String(key), toRaw(row))));
      //     }

      //     return filteredRows;
      //   }, rows)
    }

    const _task = (rows: RowData[]) => {
      const colStateCenter = this.tableState.colStateCenter;

      const rawFilterStates = this.filterStates
        .map((state) =>
          Object.assign(
            { filter: colStateCenter.getColumnByColKey(state.colKey)?.filter },
            state,
          ) as FilterStateWithConfig,
        )
        .filter((state) => typeof state.filter?.onFilter);

      return _filterTask(rows, rawFilterStates);
    };

    return _task(rowDatas);
  }

  private orderBy(
    sorterState: SorterState,
    prevRowData: RowData,
    nextRowData: RowData,
  ): number {
    const column = this.tableState.colStateCenter.getColumnByColKey(
      sorterState.colKey,
    );

    if (!column || !column.dataIndex) return CompareResult.Equal;

    const prevRowDataValue = get(prevRowData, column.dataIndex);
    const nextRowDataValue = get(nextRowData, column.dataIndex);

    // 空之间的相互对比
    if (isNil(prevRowDataValue) && isNil(nextRowDataValue))
      return CompareResult.Equal;
    if (isNil(prevRowDataValue) && !isNil(nextRowDataValue))
      return CompareResult.Greater;
    if (!isNil(prevRowDataValue) && isNil(nextRowDataValue))
      return CompareResult.Less;

    if (prevRowDataValue === nextRowDataValue) return CompareResult.Equal;

    // number string 之间的相互对比
    if (
      typeof prevRowDataValue === "number" &&
      typeof nextRowDataValue === "number"
    )
      return prevRowDataValue - nextRowDataValue;
    if (
      typeof prevRowDataValue === "string" &&
      typeof nextRowDataValue === "string"
    )
      return prevRowDataValue > nextRowDataValue
        ? CompareResult.Greater
        : CompareResult.Less;
    if (typeof prevRowDataValue === "number" && typeof nextRowData === "string")
      return CompareResult.Greater;
    if (typeof prevRowDataValue === "string" && typeof nextRowData === "number")
      return CompareResult.Less;

    // 其他之间的数据类型对比，则直接判定为相等。
    return CompareResult.Equal;
  }

  updateRawPoolRow() { }

  // 更新行数据 - 固定行高
  private createUpdateRowDatasByFixedRowHeightTask() {
    // 生成行数据的 meta
    const _createRowStateMeta = (rowKey: RowKey, index: number): RowMeta => {
      return {
        key: rowKey,
        index,
        deep: 0,
        height: this.roughRowHeight,
        _sort: index.toString(),
      };
    };

    // 生成行数据的状态
    const _createRowState = (rowData: RowData, rowKey: RowKey, index: number) => {
      const meta = _createRowStateMeta(rowKey, index);

      return new TableRowState({
        rowData: rowData,
        meta,
        rowStateCenter: this,
      })
    };

    return (oneChunk: RowData[], chunkIndex: number) => {
      oneChunk.forEach((rowData, index) => {
        let i = index + chunkIndex * ChunkSize;
        const rowKey = this.getRowKey ? this.getRowKey(rowData, i) : `0-${i}`;
        const state = _createRowState(rowData, rowKey, i);
        this.rowStateMap.set(rowKey, state);
        this.rowKeyMap.set(rowData, rowKey);
      });
    }
  }

  // 更新行数据 - 不定行高
  private createUpdateRowDatasByAutoRowHeightTask() {
    // 生成行数据的 meta
    const _createRowStateMeta = (rowData: RowData, index: number): RowMeta => {
      return {
        key: this.getRowKey ? this.getRowKey(rowData) : `0-${index}`,
        index,
        deep: 0,
        height: this.roughRowHeight,
        _sort: index.toString(),
      };
    };

    // 生成行数据的状态
    const _createRowState = (rowData: RowData, index: number) => {
      const meta = _createRowStateMeta(rowData, index);

      return new TableRowState({
        rowData: rowData,
        meta,
        rowStateCenter: this,
      });
    };
    return (oneChunk: RowData[], chunkIndex: number) => {
      oneChunk.forEach((rowData, index) => {
        const state = _createRowState(rowData, index + chunkIndex * ChunkSize);
        const rowKey = state.getMeta().key;
        this.rowStateMap.set(rowKey, state);
        this.rowKeyMap.set(rowData, rowKey);
      });
    };
  }

  // 更新行数据
  updateRowDatas(rowDatas: RowData[]) {
    this.init();

    this.tableState.viewport.scrollHeight = rowDatas.length * this.roughRowHeight;
    this.flattenYIndexes = Array(rowDatas.length).fill(null).map((_, i) => (i + 1) * this.roughRowHeight);

    // 生成最初的 key 值
    const getRowKey = this.getRowKey ?? ((_: RowData, rowIndex: number) => `0-${rowIndex}`);
    const rawRowDatas = toRaw(rowDatas);
    this.rawRowKeys = rawRowDatas.map(getRowKey);
    this.filteredRowKeys = rawRowDatas.map(getRowKey);
    this.sorteredRowKeys = rawRowDatas.map(getRowKey);
    this.flattenRowKeys = rawRowDatas.map(getRowKey);

    // 分策略更新 state。
    const _task = this.tableState.isFixedRowHeight
      ? this.createUpdateRowDatasByFixedRowHeightTask()
      : this.createUpdateRowDatasByAutoRowHeightTask();

    if (rowDatas.length > ChunkSize) {
      _task(rowDatas.slice(0, ChunkSize), 0);

      // 放入微队列中，不影响第一次渲染
      setTimeout(() => {
        const chunks = chunk(rowDatas, ChunkSize);
        for (let i = 1; i < chunks.length; i++) {
          runIdleTask(() => _task(chunks[i], i));
        }
      });
    } else {
      _task(rowDatas, 0);
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

  // TODO: 需要确认时直接生成rowkey快，还是通过 map 映射快
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
    return this.getStateByRowKey(rowKey)?.rowData ?? null;
  }

  getRowDataByFlattenIndex(index: number): RowData | null {
    const rowKey = this.flattenRowKeys[index];

    if (isNil(rowKey)) return null;

    return this.getRowDataByRowKey(rowKey);
  }

  insertRowState(rowData: RowData, meta: Partial<RowMeta>): TableRowState {
    // 首先判断是否有存在的 state，如果有，则直接返回
    const existState = this.getStateByRowData(rowData);
    if (existState) return existState;

    const rowKey = this.getRowKey ? this.getRowKey(rowData) : `${meta.deep}-${meta.index}`;

    const newMeta = Object.assign(
      {},
      { key: rowKey, height: this.roughRowHeight },
      meta,
    ) as RowMeta;

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

    const matchIndex =
      rowIndex < this.flattenRowKeys.length / 2
        ? this.flattenRowKeys.findIndex((_rowKey) => _rowKey === rowKey)
        : this.flattenRowKeys.findLastIndex((_rowKey) => _rowKey === rowKey);

    this.updateYIndexesByFlattenIndex(matchIndex);
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

  // TODO: 可以考虑使用 map + filter 代替 reduce。
  resetYIndexes() {
    let y = 0;
    this.flattenYIndexes = this.flattenRowKeys.reduce<number[]>((result, key) => {
      const state = this.getStateByRowKey(key);
      if (state) {
        y = y + state.getMeta().height;
      }
      result.push(y)
      return result;
    }, []);
  }
}
