import type { TableColumn, RowData } from "@stable/table-typing";

// 表头单元格插槽
export type HeaderCellSlot = (option: { title: any; column: TableColumn }) => unknown;

// 表体单元格插槽
export type BodyCellSlot = (option: { title: any; column: TableColumn; text: unknown; record: RowData; index: number }) => unknown;

export type ExpandIconSlot = (option: {
  expanded: boolean;
  expandable: boolean;
  record: RowData;
  onExpand: (event: Event, record: RowData) => void;
}) => unknown;

export type TableSlot = Partial<InteralTableSlot>;

export interface InteralTableSlot {
  headerCell?: HeaderCellSlot,

  // 格式化单元格
  bodyCell?: BodyCellSlot

  expandIcon: ExpandIconSlot;
}
