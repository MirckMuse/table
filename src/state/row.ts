import { chunk } from "lodash-es";
import { GetRowKey, RowData, RowKey } from "../table/typing";
import { requestIdleCallback, runIdleTask } from "../table/utils";
import { initRawState } from "./shared";
import { TableState } from ".";

export type TableRowStateOrNull = TableRowState | null;

export interface RowMeta {
  key: RowKey;

  index: number;

  deep: number;

  height: number;

  y: number;
}

export interface TableRowStateOption {
  record: RowData;

  meta: RowMeta;

  prev: TableRowStateOrNull;

  next: TableRowStateOrNull;

  rowStateCenter: TableRowStateCenter;
}

export class TableRowState {
  record: RowData;

  private meta: RowMeta;

  private prev: TableRowStateOrNull = null;

  private next: TableRowStateOrNull = null;

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
    this.next = option.next;
    this.prev = option.prev;
    this.rowStateCenter = option.rowStateCenter;
  }

  clearRawPrevDoubleLine() {
    if (this.prev) {
      if (this.prev.next === this) {
        this.prev.next = null;
      }
    }
    this.prev = null;
  }

  clearRawNextDoubleLine() {
    if (this.next) {
      if (this.next.prev === this) {
        this.next.prev = null;

      }
    }

    this.next = null;
  }

  // 清理原始双向链接
  clearRawDoubleLine() {
    this.clearRawPrevDoubleLine();
    this.clearRawNextDoubleLine();

  }

  // 更新节点。
  updatePrev(state: TableRowStateOrNull) {
    state?.clearRawNextDoubleLine();
    this.clearRawPrevDoubleLine();
    this.prev = state;
    if (state) {
      state.next = this;
    }

    // console.log(this)
  }

  // 更行下一节点的链接
  updateNext(state: TableRowStateOrNull) {
    state?.clearRawPrevDoubleLine();
    this.clearRawNextDoubleLine();

    this.next = state;
    if (state) {
      state.prev = this;
    }
  }

  // 更新行的 Y
  updateY() {
    if (!this.prev) {
      this.meta.y = 0;
      return;
    }
    const prevMeta = this.prev.getMeta()
    this.meta.y = prevMeta.y + prevMeta.height;
  }

  // 仅更新行高，返回是否行高发生变化
  justUpdateRowHeight(rowHeight: number): boolean {
    const isRowHeightChanged = this.meta.height !== rowHeight;
    this.meta.height = rowHeight;
    return isRowHeightChanged
  }

  // 更行行高
  updateRowHeight(rowHeight: number) {
    if (!this.justUpdateRowHeight(rowHeight)) return;

    if (this.meta.deep > 0) return;

    this.updateAllNextY();
  }

  // 更新所有下一行的 Y坐标
  updateAllNextY() {

    const _updateY = () => {
      this.rowStateCenter?.updateTableView()
    }
    function _run(state: TableRowState) {
      let next: TableRowState | null = state;

      if (!next) {
        _updateY()
        return;
      };

      requestIdleCallback(deadline => {
        while (next && deadline.timeRemaining() > 0) {
          next.updateY();
          next = next.next;
        }

        if (next) {
          _run(next)
        } else {
          _updateY()
        }
      })
    }

    _run(this);
  }
}

const Row_Height = 55;

export class TableRowStateCenter {

  rawRowKeys: RowKey[] = [];

  // 展开的行 key 值。在展开、筛选、排序操作会影响该指的变化。
  flattenRowKeys: RowKey[] = [];

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
    const lastMeta = this.getStateByFlattenRowIndex(this.flattenRowKeys.length - 1)?.getMeta();

    this.tableState.viewport.scrollHeight = (lastMeta?.y ?? 0) + (lastMeta?.height ?? 0);
  }

  updateDataSource(dataSource: RowData[]) {
    this.clearRowPropties();

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
      y: -1,
      height: this.roughRowHeight,
    }) as RowMeta;

    const state = new TableRowState({
      record: rowData,
      meta: newMeta,
      prev: null,
      next: null,
      rowStateCenter: this
    })

    this.rowStateMap.set(rowKey, state);
    this.rowKeyMap.set(rowData, rowKey);

    return state;
  }
}
