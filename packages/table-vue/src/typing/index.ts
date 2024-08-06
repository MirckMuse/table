import type { TableColumn, RowData, GetRowKey, RowKey, FilterState, SorterState, RawData, Option } from "@scode/table-typing";
import type { TooltipProps } from "ant-design-vue";
import type { PaginationOption } from "./emit";
import type { ExpandedRowRender } from "./slot";
import type { VNode } from "vue";

// 插槽相关
export * from "./slot";

// 组件继承的一些属性
export * from "./inherit";

export * from "./emit";

export * from "@scode/table-typing";


export type TablePaginationProps = {
  vertical?: 'top' | 'bottom';

  horizontal?: 'left' | 'right';

  // 当前分页位置
  current?: number;

  // 分页大小
  pageSize?: number;

  // 数据总量
  total?: number;
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
export interface TableProps extends ITableProcessEvent {
  prefixCls?: string;

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

  defaultExpandAllRows?: boolean;

  defaultExpandedRowKeys?: RowKey[];

  expandedRowKeys?: RowKey[];

  customRow?: CustomRow;

  transformCellText?: TransformCellText;

  // 缩进尺寸，传入数字时，这里的单位为 px。
  indentSize?: number | string;

  // 表头列数据的 key
  childrenColumnName?: string;

  // 行数据的 children key
  rowChildrenName?: string;

  custom?: ITableCustom;

  rowSelection?: boolean | ITableRowSelection;
}

export interface ITableRender {
  expandedRowRender?: ExpandedRowRender,
}

export interface InternalTableRowSelection {
  // 父子节点是否受控
  checkStrictly: boolean;

  columnTitle?: string | VNode | (() => Option<VNode>);

  columnWidth: number;

  // 是否固定，当存在有 fixed left 的列，自动为 true
  fixed: boolean;

  getCheckboxProps: (record: RawData) => any;

  // 去掉全选和反选两个选项
  hideDefaultSelections: boolean;

  // 隐藏勾选框和自定义选择项
  hideSelectAll: boolean;

  // 数据不存在时仍然保留 key，主要是提供分页使用
  preserveSelectedRowKeys: boolean;

  // 选中的行 key
  selectedRowKeys: RowKey[];

  selections: boolean | ITableRowSelectionItem[];

  type: "checkbox" | "radio";

  onChange: (selectedRowKeys: RowKey[], selectedRow: RawData[]) => void;

  onSelect: (selected: boolean, rowKey: RowKey, record: RawData, selectedRowKeys: RowKey[], selectedRows: RawData[]) => void;

  onSelectAll: (selected: boolean, selectedRowKeys: RowKey[], selectedRows: RawData[], changeRows: RawData[]) => void;

  onSelectInvert: (selectedRowKeys: RowKey[], selectedRows: RawData[]) => void;

  onSelectNone: () => void;
}

export type ITableRowSelection = Partial<InternalTableRowSelection>;

export interface ITableRowSelectionItem {
  key: string;

  text: string | VNode | (() => VNode);

  onSelect: (changeableRowKeys: RowKey[], selectedRowKeys: RowKey[]) => void;
}

export interface ITableProcessEvent {
  // 修改分页后执行的函数
  processPaginationChange?: (option: PaginationOption) => void;

  // 筛选后执行的函数
  processFilterChange?: (option: FilterState[]) => void;

  // 排序后执行的函数
  processSortChange?: (option: SorterState[]) => void;
}

// 表格组件自定义区
export interface ITableCustom {
  // 排序组件
  sorter?: any;

  // 筛选组件
  filter?: any;

  // 表头
  header?: {
    wrapper?: any;

    row?: any;

    cell?: any;
  };

  // 表体
  bodyCell?: {
    wrapper?: any;

    row?: any;

    cell?: any;
  };
}

export type TransformCellText = (option: { text: any; column: TableColumn; record: RowData; index: number }) => any;

export * from "./slot";

export type TableColumnSorterTooltip = boolean | TooltipProps;
