import type { ColKey, TableColumn } from "@stable/table-typing";
import { TableState } from "./table";
export type TableColumnOrNull = TableColumn | null;
export type TableColStateOrNull = TableColState | null;
export declare const DefaultColWidth = 120;
export declare const ColKeySplitWord = "__$$__";
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
export declare class TableColState {
    column: TableColumn;
    private meta;
    getMeta(): ColMeta;
    updateMeta(meta: Partial<ColMeta>): void;
    colStateCenter: TableColStateCenter;
    constructor(option: TableColStateOption);
    updateColWidth(width: number): void;
}
export interface TableColStateCenterOption {
    tableState: TableState;
}
export declare class TableColStateCenter {
    tableState: TableState;
    leftColKeys: ColKey[];
    lastLeftColKeys: ColKey[];
    centerColKeys: ColKey[];
    lastCenterColKeys: ColKey[];
    rightColKeys: ColKey[];
    lastRightColKeys: ColKey[];
    colKeyMap: WeakMap<TableColumn, string>;
    childrenMap: WeakMap<TableColumn, TableColumn[]>;
    parentMap: WeakMap<TableColumn, TableColumnOrNull>;
    colStateMap: Map<string, TableColState>;
    constructor(option: TableColStateCenterOption);
    init(): void;
    getStateByColKey(colKey: ColKey): TableColStateOrNull;
    getStateByColumn(column?: TableColumnOrNull): TableColStateOrNull;
    getColumnByColKey(colKey: ColKey): TableColumnOrNull;
    maxTableHeaderDeep: number;
    updateColumns(columns: TableColumn[]): void;
}
