import { RowData, RowKey } from ".";

export interface ChangeOption {
  // TODO: 后期完善
  pagination: any;

  filters: any;

  sorter: any;

  currentDataSource: any;
}

export type TableEmit = {
  (e: "change", option: ChangeOption): void;
  (e: "expand", expanded: boolean, record: RowData): void;
  (e: "update:expandedRowKeys", expandedRows: RowKey[]): void;
  (e: "expandedRowsChange", expandedRows: RowKey[]): void;
}