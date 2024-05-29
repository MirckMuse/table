import type { VNode } from "vue";

// 行数据
export type RowData = Record<string, unknown>;

export type RowDataMeta = {
  key: RowKey,
  data: RowData
}

// 行 key
export type RowKey = string | number;

// 列 key
export type ColKey = string;

export type GetRowKey = (rowData: RowData, rowIndex?: number) => RowKey;

export type TableColumnAlign = 'left' | 'right' | 'center';

export type TableColumnFixed = 'left' | 'right';

export type TableColumnTitle = string | (() => unknown);

export type TableColumnSorter = boolean | ((a: RowData, b: RowData) => number);

export enum SorterDirection {
  Ascend = 'ascend',
  Descend = 'descend',
}

// 排序状态
export type SorterState = {
  col_key: ColKey;

  direction?: SorterDirection;
}

// 筛选状态
export type FilterState = {
  // 列的 key
  col_key: ColKey;

  // 筛选值
  filter_keys?: TableColumnFilterValue[];

  // TODO: 待确认
  force_filter?: boolean;
}

export type BaseValue = string | number | boolean | undefined | null;

export type CustomRenderResult = BaseValue | VNode;

export interface CustomRenderOption extends CustomOption {
  text: BaseValue | BaseValue[];
}

// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
export type CustomRender = (option: CustomRenderOption) => CustomRenderResult | CustomRenderResult[] | undefined | void;

interface CustomOption {
  record: RowData;

  index: number;

  column: Readonly<TableColumn>;
}

export interface CustomCellOption extends CustomOption {
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type CustomCell = (option: CustomCellOption) => Record<string, any>;

export type TableColumnEllipsisObject = {
  showTitle?: boolean;

  showTooltip?: boolean;
};

export type TableColumnEllipsis = boolean | TableColumnEllipsisObject;

export type TableColumnFilterValue = string | number;

export interface TableColumnFilterOption {
  label: TableColumnFilterValue | VNode | (() => VNode);

  value: TableColumnFilterValue;

  title?: string;

  children?: TableColumnFilterOption[];
}


export type TableColumnFilterMode = "menu" | "tree";

export type TableColumnFilterSearchFn = (search: string, option: TableColumnFilterOption) => boolean;

export type TableColumnFilterSearch = boolean | TableColumnFilterSearchFn;

// 表头筛选项的配置
export interface TableColumnFilter {
  filtered?: boolean;

  filterDropdown?: VNode | ((props: TableColumnFilter) => VNode);

  open?: boolean;

  value?: string[];

  icon?: VNode | ((props: TableColumnFilter) => VNode);

  // 默认 tree
  mode?: TableColumnFilterMode;

  multiple?: boolean;

  search?: TableColumnFilterSearch;

  options?: TableColumnFilterOption[];

  onFilter?: (search: string, row: RowData) => boolean;

  onOpenChange?: (visible: boolean) => void;

  resetToDefaultFilteredValue?: boolean;

  defaultFilteredValue?: TableColumnFilterValue[];
}

/**
 * 表格列配置，key 和dataIndex 至少有一个必填
 */
export interface TableColumn {
  key?: ColKey;

  dataIndex?: string;

  align?: TableColumnAlign;

  title?: TableColumnTitle;

  minWidth?: number;

  width?: number;

  maxWidth?: number;

  // 合并单元格
  colSpan?: number;

  ellipsis?: TableColumnEllipsis;

  fixed?: boolean | TableColumnFixed;

  resizable?: boolean;

  children?: TableColumn[];

  /**
   * 是否可展开
   */
  expandable?: boolean;

  customCell?: CustomCell;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  customHeaderCell?: (column: TableColumn) => Record<string, any>;

  customRender?: CustomRender;

  // 排序相关, TODO: 要不要整合在一块呢？？
  sorter?: TableColumnSorter;

  sortOrder?: string | null;
  sortDirections?: [string, string];
  showSorterTooltip?: boolean;

  filter?: TableColumnFilter;
}