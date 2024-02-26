import type { RowKey, GetRowKey, RowData } from "@stable/table-typing";
import { runIdleTask } from "@stable/table-shared";
import { TableState } from "./table";
import { chunk, isNil } from "lodash-es";

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

export interface TableRowStateCenterOption {
  rowHeight?: number;

  getRowKey?: GetRowKey;

  tableState: TableState;
}

const DefaultRowHeight = 55;

const ChunkSize = 100;

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
