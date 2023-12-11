import { TableColumn } from "../typing";

export function isNestColumn(column: TableColumn): boolean {
  return (column.children ?? []).length > 0;
}