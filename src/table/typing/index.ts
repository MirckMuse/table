import { VNode } from "vue";
import type { TooltipProps } from "ant-design-vue";

export type TablePaginationProps = {
  vertical: 'top' | 'bottom';

  horizontal: 'left' | 'right';
};

export type RowData = Record<string, unknown> & {
  _s_row_index?: number;
};

export interface TableScroll {
  x?: number | 'max-content' | '100%' | boolean;

  y?: number | "100%";

  position?: "inner" | "outer";

  mode?: "always" | "hover";

  size?: number;
}

/**
 * 表格的参数，提供给 Table.vue 和 InteralTable.vue 使用
 */
export interface TableProps {
  loading?: boolean;

  pagination?: Partial<TablePaginationProps> | boolean;

  dataSource?: RowData[];

  columns?: TableColumn[];

  bordered?: boolean;

  scroll?: TableScroll;

  onResizeColumn?: Function;
}


export type TableColumnTitle = string | (() => string);

export type TableColumnEllipsisObject = {
  showTitle?: boolean;

  showTooltip?: boolean;
};

export type TableColumnEllipsis = boolean | TableColumnEllipsisObject;

export type TableColumnAlign = 'left' | 'right' | 'center';

export type TableColumnFixed = 'left' | 'right';

export type BaseValue = string | number | boolean | undefined | null;

export type CustomRenderResult = BaseValue | VNode;

export type CustomRenderOption = {
  text: BaseValue | BaseValue[];

  record: RowData;

  index: number;

  column: Readonly<TableColumn>;
}

export type CustomRender = (option: CustomRenderOption) => CustomRenderResult | CustomRenderResult[] | undefined | void;

export type TableColumnSorter = boolean | ((a: RowData, b: RowData) => number);

export type TableColumnSorterTooltip = boolean | TooltipProps;

/**
 * 表格列配置，key 和dataIndex 至少有一个必填
 */
export interface TableColumn {
  key?: string;

  dataIndex?: string;

  align?: TableColumnAlign;

  title?: TableColumnTitle;

  minWidth?: number;

  width?: number | string;

  maxWidth?: number;

  // 合并单元格
  colSpan?: number;

  ellipsis?: TableColumnEllipsis;

  fixed?: boolean | TableColumnFixed;

  resizable?: boolean;

  children?: TableColumn[];

  customCell?: (record: RowData, rowIndex: number, column: TableColumn) => Record<string, any>;

  customHeaderCell?: (column: TableColumn) => Record<string, any>;

  customRender?: CustomRender;

  // 排序相关
  sorter?: TableColumnSorter;

  sortOrder?: string | null;
  sortDirections?: [string, string];
  showSorterTooltip?: boolean;

  _origin?: TableColumn;

  _s_meta?: TableColumnMeta;

  _s_parent?: TableColumn;
}

export interface TableColumnMeta {
  deep?: number;

  colSpan?: number;

  rowSpan?: number;

  isLast?: boolean;
}