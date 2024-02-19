import { TableColStateCenter } from "./col";
import { TableRowStateCenter } from "./row";
import { Viewport, IViewport } from "./viewport";
import { RowData, GetRowKey, TableColumn, RowKey } from "@stable/table-typing";
export interface TableStateOption {
    rowDatas?: RowData[];
    getRowKey?: GetRowKey;
    columns?: TableColumn[];
    viewport?: IViewport;
    rowHeight?: number;
    childrenColumnName?: string;
}
export type HoverState = {
    rowIndex: number;
    rowKey: RowKey;
    colKey: string;
};
export type Scroll = {
    left: number;
    top: number;
};
export type RowDataRange = {
    startIndex: number;
    endIndex: number;
};
export type OuterRowMeta = {
    rowKey: RowKey;
    height: number;
};
export declare class TableState {
    viewport: Viewport;
    scroll: Scroll;
    colStateCenter: TableColStateCenter;
    rowStateCenter: TableRowStateCenter;
    rowOffset: {
        top: number;
        bottom: number;
    };
    hoverState: HoverState;
    childrenColumnName: string;
    constructor(option: TableStateOption);
    private init;
    updateColumns(columns: TableColumn[]): void;
    updateRowDatas(rowDatas: RowData[]): void;
    updateRowMetas(rowMetas: OuterRowMeta[]): void;
    updateViewport(width: number, height: number): void;
    updateScroll(): void;
    getViewportRowDataRange(): RowDataRange;
    _calculateRowOffset(rowIndex: number): number;
    updateRowOffsetByRange(range: RowDataRange): void;
    getViewportDataSource(): RowData[];
    getViewportHeightList(viewportDataSource: RowData[]): number[];
    isEmpty(): boolean;
    getRowDataChildren(rowData: RowData): RowData[] | undefined;
    private expandedRowKeys;
    updateExpandedRowKeys(expandedRowKeys: RowKey[]): void;
    private updateFlattenRowKeysByExpandedRowKeys;
}
