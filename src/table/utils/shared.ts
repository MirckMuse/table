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

export function noop() { }

export function genGridTemplateColumns(lastColumns: TableColumn[]) {
  return lastColumns.map(column => {
    let width = column.width;
    if (typeof width === "number") {
      width = `${width}px`;
    }
    return width ?? 'minmax(120px, 1fr)'
  }).join(" ");
}

export function toArray(target: any): any[] {
  return Array.isArray(target) ? target : [target];
}