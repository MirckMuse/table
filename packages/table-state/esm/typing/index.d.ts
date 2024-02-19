import type { VNode } from "vue";
export type RowData = Record<string, unknown>;
export type RowKey = string | number;
export type ColKey = string;
export type GetRowKey = (record: RowData) => RowKey;
export type TableColumnAlign = 'left' | 'right' | 'center';
export type TableColumnFixed = 'left' | 'right';
export type TableColumnTitle = string | (() => string);
export type TableColumnSorter = boolean | ((a: RowData, b: RowData) => number);
export type BaseValue = string | number | boolean | undefined | null;
export type CustomRenderResult = BaseValue | VNode;
export interface CustomRenderOption extends CustomOption {
    text: BaseValue | BaseValue[];
}
export type CustomRender = (option: CustomRenderOption) => CustomRenderResult | CustomRenderResult[] | undefined | void;
interface CustomOption {
    record: RowData;
    index: number;
    column: Readonly<TableColumn>;
}
export interface CustomCellOption extends CustomOption {
}
export type CustomCell = (option: CustomCellOption) => Record<string, any>;
export type TableColumnEllipsisObject = {
    showTitle?: boolean;
    showTooltip?: boolean;
};
export type TableColumnEllipsis = boolean | TableColumnEllipsisObject;
/**
 * 表格列配置，key 和dataIndex 至少有一个必填
 */
export interface TableColumn {
    key?: ColKey;
    dataIndex?: string;
    align?: TableColumnAlign;
    title?: TableColumnTitle;
    minWidth?: number;
    width?: number | string;
    maxWidth?: number;
    colSpan?: number;
    ellipsis?: TableColumnEllipsis;
    fixed?: boolean | TableColumnFixed;
    resizable?: boolean;
    children?: TableColumn[];
    customCell?: CustomCell;
    customHeaderCell?: (column: TableColumn) => Record<string, any>;
    customRender?: CustomRender;
    sorter?: TableColumnSorter;
    sortOrder?: string | null;
    sortDirections?: [string, string];
    showSorterTooltip?: boolean;
}
export {};
