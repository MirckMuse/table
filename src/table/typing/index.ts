import { VNode } from "vue";

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

export type TableColumnEllipsisObject = { showTitle?: boolean };

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