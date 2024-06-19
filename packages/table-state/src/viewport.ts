import { TableState } from "./table";

export interface IViewport {
  width: number,

  height: number,

  content_width: number,

  content_height: number,
}

export class Viewport {
  private width = 0;

  private height = 0;

  private content_width = 0;

  private _content_height = 0;

  private table_state: TableState;

  constructor(table_state: TableState) {
    this.table_state = table_state;
  }

  get content_height() {
    // 如果是分页表格，按照当前分页高度来判定高度。
    const pagination = this.table_state.pagination;
    console.log(pagination)
    if (pagination) {
      const { size, page, total } = pagination;
      if (this.table_state.row_state.is_fixed_row_height()) {
        return size * this.table_state.row_state.get_row_height();
      } else {
        const flatten_row_y = this.table_state.flatten_row_y
        let from_index = Math.max(size * (page - 1), 0);
        let to_index = Math.min(size * page, total) - 1;
        if (from_index < to_index) {
          return flatten_row_y[to_index] - flatten_row_y[from_index]
        } else {
          return 0
        }
      }
    }

    return this._content_height;
  }

  get_width() {
    return this.width;
  }

  set_width(new_width: number) {
    this.width = new_width;
  }

  get_height() {
    return this.height;
  }

  set_height(new_height: number) {
    this.height = new_height;
  }

  get_content_width() {
    return this.content_width;
  }

  set_content_width(width: number) {
    this.content_width = width;
  }

  get_content_height() {
    return this.content_height;
  }

  set_content_height(height: number) {
    this._content_height = height;
  }
}