import { ColKey, ColState } from "../col";
import { RowKey, RowState } from "../row";

export interface CellMeta {
  x: number;

  y: number;

  row_key: RowKey;

  col_key: ColKey;
}

export interface MergedCellMeta extends CellMeta {
  row_span: number;

  col_span: number;
}

export class Cell {

  constructor(readonly row_state: RowState, readonly col_state: ColState, readonly meta: CellMeta) {
  }

  get height(): number {
    return this.row_state.get_row_height_by_row_key(this.meta.row_key);
  }

  get width(): number {
    return this.col_state.get_col_width_by_col_key(this.meta.col_key);
  }
}


// TODO: 当配置存在合并行时，需要使用该类
export class MergedCell {
  constructor(readonly meta: MergedCellMeta) { }

  // TODO:
  get height() {
    return 56;
  }

  // TODO:
  get width() {
    return 56;
  }
}