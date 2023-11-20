export type TablePaginationProps = {
  vertical: 'top' | 'bottom';

  horizontal: 'left' | 'right';
};

export type RowData = Record<string, unknown>;

/**
 * 表格的参数，提供给 Table.vue 和 InteralTable.vue 使用
 */
export interface TableProps {
  loading?: boolean;

  pagination?: Partial<TablePaginationProps> | boolean;

  dataSource?: RowData[];

  columns?: TableColumn[];
}


export type TableColumnTitle = string | (() => string);

/**
 * 表格列配置，key 和dataIndex 至少有一个必填
 */
export interface TableColumn {
  key?: string;

  dataIndex?: string;

  title?: TableColumnTitle;

  width?: number | string;
}