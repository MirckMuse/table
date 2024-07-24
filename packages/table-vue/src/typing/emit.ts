import type { FilterState, RowData, RowKey, SorterState } from "@scode/table-typing";

export interface PaginationOption {
  page: number,

  size: number
}

export interface ChangeOption {
  pagination: PaginationOption;

  filters?: FilterState[];

  sorter?: SorterState[];

  currentDataSource: RowData[];
}

export type TableEmit = {
  // 分页、筛选、排序操作后均会调用 change 事件
  (e: "change", option: ChangeOption): void;
  (e: "change:pagination", option: PaginationOption): void;
  (e: "change:filter", option: FilterState[]): void;
  (e: "change:sort", option: SorterState[]): void;
  (e: "expand", expanded: boolean, record: RowData): void;
  (e: "update:expandedRowKeys", expandedRows: RowKey[]): void;
  (e: "expandedRowsChange", expandedRows: RowKey[]): void;
}