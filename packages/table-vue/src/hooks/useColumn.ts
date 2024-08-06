import type { TableColumn, TableProps } from "../typing";
import { getDFSLastColumns } from "../utils";

// 标准化列配置信息
export function normalizeColumns(tableProps: TableProps): TableColumn[] {
  const clonedColumns = ([] as TableColumn[]).concat(tableProps.columns || []);

  const lastColumn: TableColumn[] = getDFSLastColumns(clonedColumns);

  if (lastColumn.length && !lastColumn.some((col) => col.expandable)) {
    lastColumn[0].expandable = true;
  }

  // 如果有选择项目，则直接给列配置添加选择列
  if (tableProps.rowSelection) {
    // TODO:
  }

  return clonedColumns;
}