import type { ColKey, TableColumn } from "@scode/table-typing";
import { isNil } from "lodash-es";

export type TableColumnOrNull = TableColumn | null;

export type ColKeyOrNull = ColKey | null;

export type TableColStateOrNull = TableColState | null;

export const DefaultColWidth = 120;
export const DefaultColHeight = 52;

export const ColKeySplitWord = "__$$__";

export type ColMetaFixed = false | "left" | "right";

// 列的元信息
export interface ColMeta {
  key: ColKey;

  width: number;

  height: number;

  deep: number;

  fixed: ColMetaFixed;

  col_span: number;

  row_span: number;

  sort: number;

  is_leaf: boolean;
}

export type ColMetaOrNull = ColMeta | null;


export interface TableColStateOption {
}

export class TableColState {
  seed = 0;

  private column_map_col_key = new WeakMap<TableColumn, ColKey>();

  private col_key_map_column = new Map<ColKey, TableColumn>();

  private col_key_map_children = new Map<ColKey, ColKey[]>();

  private col_key_map_parent = new Map<ColKey, ColKey | null>();

  private col_key_map_col_meta = new Map<ColKey, ColMeta>();

  constructor(option: TableColStateOption) {
  }

  private init() {
    this.seed = 0;
    this.col_key_map_column.clear();
    this.col_key_map_children.clear();
    this.col_key_map_parent.clear();
    this.col_key_map_col_meta.clear();
  }

  /// 获取最大 deep。
  get_max_deep() {
    return Math.max(...Array.from(this.col_key_map_col_meta.values()).map(meta => meta.deep))
  }

  get_all_meta(): ColMeta[] {
    return Array.from(this.col_key_map_col_meta.values());
  }

  /// 根据 col_key 获取列的元数据，没有则返回 null。
  get_meta_by_col_key(col_key: ColKey): ColMetaOrNull {
    return this.col_key_map_col_meta.get(col_key) ?? null;
  }

  get_meta_by_column(column?: TableColumnOrNull): ColMetaOrNull {
    if (isNil(column)) return null;

    const col_key = this.column_map_col_key.get(column);

    if (isNil(col_key)) return null;

    return this.get_meta_by_col_key(col_key);
  }

  get_column_by_col_key(col_key: ColKey): TableColumnOrNull {
    return this.col_key_map_column.get(col_key) ?? null;
  }

  get_col_key_by_column(column?: TableColumnOrNull): ColKeyOrNull {
    if (isNil(column)) return null;

    return this.column_map_col_key.get(column) ?? null;
  }

  get_col_width_by_col_key(col_key: ColKey): number {
    return this.get_meta_by_col_key(col_key)?.width ?? 0;
  }

  get_col_height_by_col_key(col_key: ColKey): number {
    return this.get_meta_by_col_key(col_key)?.height ?? 0;
  }

  get_col_width_by_column(column?: TableColumnOrNull): number {
    return this.get_meta_by_column(column)?.width ?? 0;
  }

  get_col_height_by_column(column?: TableColumnOrNull): number {
    return this.get_meta_by_column(column)?.height ?? 0;
  }

  get_parent_meta_by_col_key(col_key: ColKey): ColMetaOrNull {
    const parent_col_key = this.col_key_map_parent.get(col_key)

    return parent_col_key
      ? this.get_meta_by_col_key(parent_col_key) ?? null
      : null;
  }

  get_children_meta_by_col_key(col_key: ColKey): ColMetaOrNull[] {
    return (this.col_key_map_children.get(col_key) ?? []).map((col_key) => this.get_meta_by_col_key(col_key));
  }

  private create_col_meta(column: TableColumn, col_index: number, parent: TableColumnOrNull): ColMeta {
    const parent_col_meta = this.get_meta_by_column(parent);
    const deep = (parent_col_meta?.deep ?? -1) + 1;
    const col_key = [column.key ?? column.dataIndex ?? "", col_index, deep].join(ColKeySplitWord);

    const fixed = (column.fixed ? column.fixed : false) as ColMetaFixed;

    return {
      key: col_key,
      width: column.width ?? DefaultColWidth,
      height: DefaultColHeight,
      deep,
      sort: ++this.seed,
      col_span: column.colSpan ?? 1,
      row_span: 1,
      fixed: fixed && typeof column.fixed === "boolean" ? "left" : fixed,
      is_leaf: !column.children?.length,
    }
  }

  private update_columns_meta(columns: TableColumn[], parent: TableColumnOrNull) {
    const parent_col_key = this.get_meta_by_column(parent)?.key ?? null;
    const children: ColKey[] = [];

    columns.forEach((column, col_index) => {
      const col_meta = this.create_col_meta(column, col_index, parent);
      const col_key = col_meta.key;

      this.column_map_col_key.set(column, col_key);
      this.col_key_map_column.set(col_key, column);
      this.col_key_map_parent.set(col_key, parent_col_key);
      this.col_key_map_col_meta.set(col_key, col_meta);
      if (parent_col_key) {
        children.push(col_key);
      }

      if (column.children?.length) {
        this.update_columns_meta(column.children, column);
      }
    });

    if (parent_col_key) {
      this.col_key_map_children.set(parent_col_key, children);
    }
  }


  update_columns(columns: TableColumn[]) {
    this.init();

    this.update_columns_meta(columns, null);
  }

  update_col_width_by_col_key(col_key: ColKey, new_width: number) {
    const meta = this.get_meta_by_col_key(col_key);

    if (!meta) return;

    meta.width = new_width;
    let parent_col_meta: ColMetaOrNull = this.get_parent_meta_by_col_key(col_key)

    while (parent_col_meta) {

      parent_col_meta.width = this.get_children_meta_by_col_key(parent_col_meta.key).reduce((width, meta) => {
        return width + (meta?.width ?? 0)
      }, 0);

      parent_col_meta = this.get_parent_meta_by_col_key(parent_col_meta.key);
    }
  }

  /// TODO: 高度的计算比较麻烦，需要考虑一下怎么确保高度保持一致。
  update_col_height_by_col_key(col_key: ColKey, new_height: number) {
    const meta = this.get_meta_by_col_key(col_key);
    if (!meta) return;

    meta.height = new_height;
  }
}
