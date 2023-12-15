import { TableColumn } from "../typing";

export function isNestColumn(column: TableColumn): boolean {
  return (column.children ?? []).length > 0;
}

export function getDFSLastColumns(columns: TableColumn[]): TableColumn[] {
  return columns.reduce<TableColumn[]>((cols, col) => {
    if (isNestColumn(col)) {
      return cols.concat(...getDFSLastColumns(col.children!));
    }

    return cols.concat(col);
  }, []);
}

export function px2Number(target: string): number {
  return Number(target.replace("px", ""));
}