import {chunk} from "lodash-es";
import {GetRowKey, RowData, RowKey} from "../table/typing";
import {requestIdleCallback, runIdleTask} from "../table/utils";
import {initRawState} from "./shared";
import {TableState} from ".";

export type TableRowStateOrNull = TableRowState | null;

export interface RowMeta {
  key: RowKey;

  index: number;

  deep: number;

  height: number;
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

  updateTableView() {
    let reduceHeight = 0;
    this.flattenYIndexes = this.flattenRowKeys.reduce((heights, rowKey) => {
      reduceHeight = reduceHeight + (this.getStateByRowKey(rowKey)?.getMeta().height ?? 0);
      heights.push(reduceHeight)
      return heights;
    }, []);

    this.tableState.viewport.scrollHeight = reduceHeight;
  }

  updateDataSource(dataSource: RowData[]) {
    this.clearRowPropties();

    // 粗略计算一下滚动高度
    this.tableState.viewport.scrollHeight = dataSource.length * this.roughRowHeight;
    this.flattenYIndexes = dataSource.map((_, index) => this.roughRowHeight * (index + 1))

    initRawState(dataSource, {
      roughHeight: this.roughRowHeight,
      getRowKey: this.getRowKey,
      map: this.rowStateMap,
      keyMap: this.rowKeyMap,
      rawRowKeys: this.rawRowKeys,
      flattenRowKeys: this.flattenRowKeys,
      rowStateCenter: this,
      updateTableView: () => {
        this.updateTableView()
      }
    });
  }

  getStateByRowData(rowData: RowData) {
    const rowKey = this.rowKeyMap.get(rowData);

    return rowKey ? this.getStateByRowKey(rowKey) : undefined;
  }

  getStateByRowKey(rowKey: RowKey) {
    return this.rowStateMap.get(rowKey);
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
