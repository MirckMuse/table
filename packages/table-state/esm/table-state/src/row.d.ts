import { RowKey, GetRowKey, RowData } from "@stable/table-typing";
import { TableState } from "./table";
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
export declare class TableRowState {
    rowData: RowData;
    private meta;
    getMeta(): RowMeta;
    updateMeta(meta: Partial<RowMeta>): void;
    rowStateCenter: TableRowStateCenter;
    constructor(option: TableRowStateOption);
    updateHeight(height: number): void;
}
export interface TableRowStateCenterOption {
    rowHeight?: number;
    getRowKey?: GetRowKey;
    tableState: TableState;
}
export declare class TableRowStateCenter {
    rawRowKeys: RowKey[];
    flattenRowKeys: RowKey[];
    flattenYIndexes: number[];
    private rowStateMap;
    private rowKeyMap;
    private tableState;
    private roughRowHeight;
    private getRowKey;
    constructor(option: TableRowStateCenterOption);
    private init;
    updateRowDatas(rowDatas: RowData[]): void;
    getStateByRowData(rowData: RowData): TableRowStateOrNull;
    getStateByRowKey(rowKey: RowKey): TableRowStateOrNull;
    getStateByFlattenIndex(index: number): TableRowStateOrNull;
    getRowHeight(state?: TableRowStateOrNull): number;
    getRowHeightByRowKey(rowKey: RowKey): number;
    getRowHeightByRowData(rowData: RowData): number;
    getRowHeightByFlattenIndex(index: number): number;
    getRowDataByRowKey(rowKey: RowKey): RowData | null;
    getRowDataByFlattenIndex(index: number): RowData | null;
    insertRowState(rowData: RowData, meta: Partial<RowMeta>): TableRowState;
    updateYIndexesByRowKey(rowKey?: RowKey): void;
    updateYIndexesByFlattenIndex(index?: number): void;
}
