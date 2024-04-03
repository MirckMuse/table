import type { ColKey, TableColumn } from "@scode/table-typing";
import { TableState } from "./table";
import { isNil } from "lodash-es";

export type TableColumnOrNull = TableColumn | null;

export type ColKeyOrNull = ColKey | null;

export type TableColStateOrNull = TableColState | null;

export const DefaultColWidth = 120;

export const ColKeySplitWord = "__$$__";

// 列的元信息
export interface ColMeta {
  key: ColKey;

  width: string | number;

  deep?: number;

  colSpan?: number;

  rowSpan?: number;

  isLeaf?: boolean;
}

export interface TableColStateOption {
  column: TableColumn;

  meta: ColMeta;

  colStateCenter: TableColStateCenter;
}

// 列信息状态
export class TableColState {
  column: TableColumn;

  private meta: ColMeta;

  getMeta() {
    return Object.assign({}, this.meta);
  }

  updateMeta(meta: Partial<ColMeta>) {
    Object.assign(this.meta, meta);
  }

  public colStateCenter: TableColStateCenter;

  constructor(option: TableColStateOption) {
    this.colStateCenter = option.colStateCenter;
    this.meta = option.meta;
    this.column = option.column;
  }

  updateColWidth(width: number) {
    this.updateMeta({ width })
  }
}

export interface TableColStateCenterOption {
  tableState: TableState;
}

export class TableColStateCenter {
  tableState: TableState;

  // 左侧
  leftColKeys: ColKey[] = [];
  lastLeftColKeys: ColKey[] = [];

  // 中间
  centerColKeys: ColKey[] = [];
  lastCenterColKeys: ColKey[] = [];

  // 右侧
  rightColKeys: ColKey[] = [];
  lastRightColKeys: ColKey[] = [];

  // 列 key 的映射
  colKeyMap = new WeakMap<TableColumn, ColKey>();

  childrenMap = new WeakMap<TableColumn, TableColumn[]>();

  parentMap = new WeakMap<TableColumn, TableColumnOrNull>();

  colStateMap = new Map<ColKey, TableColState>();

  constructor(option: TableColStateCenterOption) {
    this.tableState = option.tableState;
  }

  init() {
    this.leftColKeys = [];
    this.lastLeftColKeys = [];
    this.centerColKeys = [];
    this.lastCenterColKeys = [];
    this.rightColKeys = [];
    this.lastRightColKeys = [];
  }

  getStateByColKey(colKey: ColKey): TableColStateOrNull {
    return this.colStateMap.get(colKey) ?? null;
  }

  getStateByColumn(column?: TableColumnOrNull): TableColStateOrNull {
    if (isNil(column)) return null;

    const colKey = this.colKeyMap.get(column);

    if (isNil(colKey)) return null;

    return this.getStateByColKey(colKey);
  }

  getColumnByColKey(colKey: ColKey): TableColumnOrNull {
    return this.getStateByColKey(colKey)?.column ?? null;
  }

  getColKeyByColumn(column: TableColumn): ColKeyOrNull {
    return this.colKeyMap.get(column) ?? null
  }

  maxTableHeaderDeep = 0;

  updateColumns(columns: TableColumn[]) {
    this.init();

    let maxDeep = -1;

    const _createColMeta = (column: TableColumn, index: number, parent: TableColumnOrNull): ColMeta => {
      const parentColState = this.getStateByColumn(parent);

      const deep = (parentColState?.getMeta().deep ?? -1) + 1;

      maxDeep = Math.max(maxDeep, deep);

      const key = [column.key ?? column.dataIndex ?? "", index, deep].join(ColKeySplitWord);

      return {
        key,
        width: column.width ?? DefaultColWidth,
        deep: deep,
        isLeaf: !column.children?.length,
        colSpan: isNil(column.colSpan) ? 1 : column.colSpan
      }

    }

    const _createState = (column: TableColumn, index: number, parent: TableColumnOrNull): TableColState => {
      const meta = _createColMeta(column, index, parent);

      return new TableColState({
        column,
        meta,
        colStateCenter: this,
      });
    }

    const _initState = (column: TableColumn, index: number, parent: TableColumnOrNull) => {
      const state = _createState(column, index, parent);

      const colKey = state.getMeta().key;

      this.colKeyMap.set(column, colKey);
      this.parentMap.set(column, parent);
      if (parent) {
        const children = this.childrenMap.get(parent) ?? [];
        children.push(column);
        this.childrenMap.set(parent, children)
      }
      this.colStateMap.set(colKey, state);
    }

    const _notFixedColumn = (column: TableColumn) => {
      return column.fixed !== true && column.fixed !== "left" && column.fixed !== "right";
    }

    const fixedLeftIndex = columns.findIndex(_notFixedColumn) - 1;
    const fixedRightIndex = columns.findLastIndex(_notFixedColumn) + 1;

    const leftColKeyMap = new Map<number, ColKey[]>();
    const centerColKeyMap = new Map<number, ColKey[]>();
    const rightColKeyMap = new Map<number, ColKey[]>();

    const _isLeft = (index: number, root: TableColumnOrNull) => {
      if (root) {
        const colKeys = leftColKeyMap.get(0) ?? [];
        const colKey = this.colKeyMap.get(root)
        return colKey ? colKeys.includes(colKey) : false;
      }

      return fixedLeftIndex >= index
    }

    const _isRight = (index: number, root: TableColumnOrNull) => {
      if (root) {
        const colKeys = rightColKeyMap.get(0) ?? [];
        const colKey = this.colKeyMap.get(root)
        return colKey ? colKeys.includes(colKey) : false;
      }

      return index >= fixedRightIndex;
    }

    const _updateKeyMap = (map: Map<number, ColKey[]>, state: TableColState) => {
      const deep = state.getMeta().deep ?? 0;
      const colKeys = map.get(deep) ?? [];
      colKeys.push(state.getMeta().key);
      map.set(deep, colKeys)
    }


    const _task = (colums: TableColumn[], parent: TableColumnOrNull = null, root: TableColumnOrNull = null) => {
      colums.forEach((column, index) => {
        _initState(column, index, parent);

        const state = this.getStateByColumn(column);

        if (state) {
          const colKey = state.getMeta().key;

          if (_isLeft(index, root)) {
            _updateKeyMap(leftColKeyMap, state);
            if (!column.children?.length) {
              this.lastLeftColKeys.push(colKey);
            }
          } else if (_isRight(index, root)) {
            _updateKeyMap(rightColKeyMap, state);
            if (!column.children?.length) {
              this.lastRightColKeys.push(colKey);
            }
          } else {
            _updateKeyMap(centerColKeyMap, state);
            if (!column.children?.length) {
              this.lastCenterColKeys.push(colKey);
            }
          }
        }

        if (column.children?.length) {
          _task(column.children, column, root || column)
        }
      })
    }
    _task(columns);

    this.maxTableHeaderDeep = maxDeep;

    this.leftColKeys = Array.from(leftColKeyMap.values()).flat(1);
    this.centerColKeys = Array.from(centerColKeyMap.values()).flat(1);
    this.rightColKeys = Array.from(rightColKeyMap.values()).flat(1);

    const _updateSpan = (colKey: ColKey) => {
      const state = this.getStateByColKey(colKey);
      if (!state) return;

      const children = this.childrenMap.get(state.column);

      if (children?.length) {
        state.updateMeta({
          colSpan: children.reduce((prev, next) => {
            return (this.getStateByColumn(next)?.getMeta().colSpan ?? 1) + prev;
          }, 0)
        })
      }
      if (state.getMeta().isLeaf) {
        state.updateMeta({
          rowSpan: maxDeep + 1 - (state.getMeta().deep ?? 0)
        })
      }
    }

    this.leftColKeys.forEach(_updateSpan)
    this.centerColKeys.forEach(_updateSpan)
    this.rightColKeys.forEach(_updateSpan)
  }
}