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
}

export class TableRowState {
  record: RowData;

  private meta: RowMeta;

  private prev: TableRowStateOrNull = null;

  private next: TableRowStateOrNull = null;

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
      console.log(state)
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
    const prevMeta = this.prev.meta
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

    this.updateAllNextY();
  }

  // 更新所有下一行的 Y坐标
  updateAllNextY() {
    function _run(state: TableRowState) {
      let next: TableRowState | null = state;

      if (!next) return;

      requestIdleCallback(deadline => {
        while (next && deadline.timeRemaining() > 0) {
          next.updateY();
          next = next.next;
        }

        if (next) {
          _run(next)
        }
      })
    }

    _run(this);
  }
}

const Row_Height = 55;

export class TableRowStateCenter {

  rawRowKeys: RowKey[] = [];

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

  updateDataSource(dataSource: RowData[]) {
    this.clearRowPropties();

    const _chunkSize = 200;
    const chunks = chunk(dataSource, _chunkSize);

    const _update = (_chunk: RowData[], chunkIndex: number) => {
      const { rowKeys } = initRawState(dataSource, {
        roughHeight: this.roughRowHeight,
        getRowKey: this.getRowKey,
        startIndex: _chunkSize * chunkIndex,
        map: this.rowStateMap,
        keyMap: this.rowKeyMap,
      });
      this.rawRowKeys.push(...rowKeys)
      this.flattenRowKeys.push(...rowKeys)

      const lastRowMeta = this.getStateByRowKey(rowKeys[rowKeys.length - 1])?.getMeta();

      this.tableState.viewport.scrollHeight = (lastRowMeta?.height ?? 0) + (lastRowMeta?.y ?? 0);
    }

    _update(chunks[0], 0);
    for (let i = 1; i < chunks.length; i++) {
      runIdleTask(() => {
        _update(chunks[i], i)
      });
    }
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
      next: null
    })

    this.rowStateMap.set(rowKey, state);
    this.rowKeyMap.set(rowData, rowKey);

    return state;
  }
}
