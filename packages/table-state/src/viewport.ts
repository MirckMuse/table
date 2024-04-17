import { TableState } from "./table";

export interface IViewport {
  width: number,

  height: number,

  scrollWidth: number,

  scrollHeight: number,
}

export class Viewport implements IViewport {
  width = 0;

  height = 0;

  scrollWidth = 0;

  scrollHeight = 0;

  constructor(readonly table_state: TableState) { }

  get scroll_height() {
    const { pagination, isFixedRowHeight, rowStateCenter } = this.table_state;
    if (pagination) {
      const { page, size, total } = pagination;

      // 固定高度的表格，最大滚动高度为数据的高度，小于最后一页，为size * rowHeight, 最后一页，为剩余数据的高度

      if (isFixedRowHeight) {
        return Math.ceil(total / size) > page
          ? size * rowStateCenter.rowHeight
          : (total - page * size) * rowStateCenter.rowHeight;
      }

      // 不定行高的情况，则需要累加得到滚动高度
      return pagination.get_pagination_row_keys(rowStateCenter.flattenRowKeys).reduce<number>((acc, rowKey) => {
        const rowHeight = rowStateCenter.getRowHeightByRowKey(rowKey);
        return acc + rowHeight;
      }, 0);
    }

    return this.scrollHeight;
  }
}