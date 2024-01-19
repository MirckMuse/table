import {GetRowKey, RowData, RowKey} from "../table/typing";
import {initRawState} from "./shared";
import {TableState} from ".";

export type TableRowStateOrNull = TableRowState | null;

export interface RowMeta {
  key: RowKey;

  index: number;

  deep: number;

  height: number;

  _sort: string;
}

export interface TableRowStateOption {
  record: RowData;

  meta: RowMeta;

  rowStateCenter: TableRowStateCenter;
}

export class TableRowState {
  record: RowData;

  private meta: RowMeta;

  private rowStateCenter: TableRowStateCenter;

  // 获取只读的行元数据
  getMeta(): Readonly<RowMeta> {
    return Object.assign({}, this.meta);
  }

  updateMeta(meta: Partial<RowMeta>) {
    Object.assign(this.meta, meta)
  }

  constructor(option: TableRowStateOption) {
    this.record = option.record;
    this.meta = option.meta;
    this.rowStateCenter = option.rowStateCenter;
  }

  // 更行行高
  updateRowHeight(rowHeight: number) {
    this.meta.height = rowHeight;
  }
}

const Row_Height = 55;

export class TableRowStateCenter {

  rawRowKeys: RowKey[] = [];

  // 展开的行 key 值。在展开、筛选、排序操作会影响该指的变化。
  flattenRowKeys: RowKey[] = [];

  // 扁平的 Y 值的索引
  flattenYIndexes: number[] = [];

  rowStateMap = new Map<RowKey, TableRowState>();

  private rowKeyMap: WeakMap<RowData, RowKey> = new WeakMap();

  roughRowHeight = Row_Height;

  getRowKey?: GetRowKey = () => -1;

  tableState: TableState;

  constructor(option: { rowHeight: number, getRowKey?: GetRowKey, tableState: TableState }) {
    this.roughRowHeight = option.rowHeight;
    this.getRowKey = option.getRowKey;
    this.tableState = option.tableState;
  }

  // 初始化数据行相关的属性
  private clearRowPropties() {
    this.rawRowKeys = [];
    this.flattenRowKeys = [];
    this.rowStateMap.clear();
  }

  updateFlattenYIndexesByRowKey(rowKey?: RowKey) {
    if (!rowKey) {
      this.updateFlattenYIndexesByRowIndex();
      return;
    }

    const rowIndex = this.getStateByRowKey(rowKey)?.getMeta().index ?? -1;

    const matchIndex = rowIndex < (this.flattenRowKeys.length / 2)
      ? this.flattenRowKeys.findIndex(_rowKey => _rowKey === rowKey)
      : this.flattenRowKeys.findLastIndex(_rowKey => _rowKey === rowKey);

    this.updateFlattenYIndexesByRowIndex(matchIndex)
  }

  updateFlattenYIndexesByRowIndex(index: number = 0) {

    index = Math.max(index, 0);
    let reduceHeight = this.flattenYIndexes[index - 1] || 0;
    let length = this.flattenYIndexes.length;

    for (let i = index; i < length - 1; i++) {
      this.flattenYIndexes[i] = reduceHeight + this.getRowHeightByRowKey(this.flattenRowKeys[i]);
      reduceHeight = this.flattenYIndexes[i];
    }
  }

  updateDataSource(dataSource: RowData[]) {
    this.clearRowPropties();

    const chunkSize = 100;

    // 粗略计算一下滚动高度
    this.tableState.viewport.scrollHeight = dataSource.length * this.roughRowHeight;
    this.flattenYIndexes = Array(chunkSize).fill(null).map((_, i) => (i + 1) * this.roughRowHeight)

    initRawState(dataSource, {
      roughHeight: this.roughRowHeight,
      getRowKey: this.getRowKey,
      map: this.rowStateMap,
      chunkSize: chunkSize,
      keyMap: this.rowKeyMap,
      rawRowKeys: this.rawRowKeys,
      flattenRowKeys: this.flattenRowKeys,
      rowStateCenter: this
    });
  }

  getStateByRowData(rowData: RowData) {
    const rowKey = this.rowKeyMap.get(rowData);

    return rowKey ? this.getStateByRowKey(rowKey) : undefined;
  }

  getStateByRowKey(rowKey: RowKey) {
    return this.rowStateMap.get(rowKey);
  }

  getRowHeight(state?: TableRowState) {
    return state?.getMeta().height ?? this.roughRowHeight;
  }

  getRowHeightByRowKey(rowKey: RowKey) {
    return this.getRowHeight(this.getStateByRowKey(rowKey))
  }

  getStateByFlattenRowIndex(index: number) {
    return this.getStateByRowKey(this.flattenRowKeys[index]);
  }

  getRowDataByRowKey(rowKey: RowKey) {
    return this.getStateByRowKey(rowKey)?.record
  }

  getRowDataByFlattenRowKeyIndex(index: number) {
    return this.getRowDataByRowKey(this.flattenRowKeys[index])
  }

  insertRowState(rowData: RowData, meta: Partial<RowMeta>): TableRowState {
    const rowKey = this.getRowKey ? this.getRowKey(rowData) : `${meta.deep}-${meta.index}`;

    const newMeta = Object.assign({}, meta, {
      key: rowKey,
      height: this.roughRowHeight,
    }) as RowMeta;

    const state = new TableRowState({
      record: rowData,
      meta: newMeta,
      rowStateCenter: this
    })

    this.rowStateMap.set(rowKey, state);
    this.rowKeyMap.set(rowData, rowKey);

    return state;
  }
}
