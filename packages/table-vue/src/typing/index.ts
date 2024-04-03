import type { TableColumn, RowData, GetRowKey, RowKey } from "@scode/table-typing";
import type { TooltipProps } from "ant-design-vue";


// 插槽相关
export * from "./slot";

// 组件继承的一些属性
export * from "./inherit";

export * from "./emit";


export type TablePaginationProps = {
  vertical: 'top' | 'bottom';

  horizontal: 'left' | 'right';
};

export interface TableScroll {
  x?: number | 'max-content' | '100%' | boolean;

  y?: number | "100%";

  position?: "inner" | "outer";

  mode?: "always" | "hover";

  size?: number;
}

export interface Selection {
  colKey: string;

  rowKey: string;
}

export type CustomRow = (record: RowData, index: number) => any;

/**
 * 表格的参数，提供给 Table.vue 和 InteralTable.vue 使用
 */
export interface TableProps {
  loading?: boolean;

  // 固定行高
  rowHeight?: number;

  pagination?: Partial<TablePaginationProps> | boolean;

  dataSource?: RowData[];

  columns?: TableColumn[];

  bordered?: boolean;

  scroll?: TableScroll;

  onResizeColumn?: Function;

  rowKey?: string | GetRowKey;

  expandedRowKeys?: RowKey[];

  customRow?: CustomRow;

  transformCellText?: TransformCellText;

  // 缩进尺寸，传入数字时，这里的单位位 px。
  indentSize?: number | string;

  childrenColumnName?: string;
}

export type TransformCellText = (option: { text: any; column: TableColumn; record: RowData; index: number }) => any;


export * from "./slot";

export interface TableColumnMeta {
  deep?: number;

  colSpan?: number;

  rowSpan?: number;

  isLast?: boolean;
}

export type TableColumnSorterTooltip = boolean | TooltipProps;
