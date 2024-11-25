import { isNil } from "lodash-es";

/// 原始行数据
export type RawData = Record<string, unknown>;

/// 行 key
export type RowKey = string;

/// 参考 rust 的 Option
export type Option<T> = T | null;

/// 获取行的 key 值
export type GetRowKey = (raw_data: RawData, row_index?: number) => RowKey;

export interface RowMeta {
  key: RowKey;

  index: number;

  deep: number;

  height: number;

  sort: string;

  expand_by?: RowKey[];
}

export interface RowStateOption {
  row_height?: number;

  get_row_key: () => RowKey;

  row_children_key: string;
}

/// 默认: 行高
export const DEFAULT_ROW_HEIGHT = 56;

/// 默认：行子元素的key
export const DEFAULT_ROW_CHILDREN_KEY = "children"

/// 默认：获取行 key
export const DEFAULT_GET_ROW_KEY = (_: RawData, row_index: number) => `0-${row_index}`

export class RowState {
  // 行高, 当固定行高时，则
  row_height: number;

  // 是否为固定行高的表格
  is_fixed_row_height: boolean;

  get_raw_children: (raw_data: RawData) => Option<RawData[]>;

  get_row_key: GetRowKey;

  // 根据行的 row_key 获取对应的行高
  get_row_height_by_row_key!: (row_key: RowKey) => number;

  private raw_row_keys: RowKey[] = [];

  private raw_raw_datas: RawData[] = [];

  private raw_flatten_raw_keys: RowKey[] = [];

  private row_key_map_row_meta: Map<RowKey, RowMeta> = new Map();

  private raw_data_map_row_key: WeakMap<RawData, RowKey> = new WeakMap();

  private row_key_map_raw_data: Map<RowKey, RawData> = new Map();

  constructor(option: RowStateOption) {
    // 初始化参数
    this.is_fixed_row_height = isNil(option.row_height);
    this.row_height = option.row_height ?? DEFAULT_ROW_HEIGHT;
    this.get_raw_children = (raw_data: RawData) => {
      const children = raw_data[option.row_children_key];
      if (Array.isArray(children)) {
        return children as RawData[];
      }
      return null;
    };

    this.get_row_key = option.get_row_key || DEFAULT_GET_ROW_KEY;

    // 初始化一些相关参数
    this.before_init()
  }

  protected before_init() {
    this.init_get_row_height();
  }

  // 初始化相关参数
  protected init() {
    this.raw_row_keys = [];
    this.raw_raw_datas = [];
    this.raw_flatten_raw_keys = [];
    this.row_key_map_row_meta.clear();
    this.raw_data_map_row_key = new WeakMap();
    this.row_key_map_raw_data.clear();
  }

  // 初始化获取行高的函数
  protected init_get_row_height() {
    this.get_row_height_by_row_key = this.is_fixed_row_height
      ? () => this.row_height
      : (row_key: RowKey) => {
        const meta = this.get_meta_by_row_key(row_key);
        return meta?.height ?? this.row_height;
      }
  }

  /// 根据行的 key 获取元数据
  get_meta_by_row_key(row_key: RowKey): Option<RowMeta> {
    return this.row_key_map_row_meta.get(row_key) ?? null;
  }

  // 扁平数据，提供 update_row_data 使用。
  protected flatten(
    datas: RawData[],
    deep = 0,
    callback: (raw_data: RawData, index: number, parent_meta: Option<RowMeta>) => RowMeta,
    parent_meta: Option<RowMeta>
  ) {
    for (let row_index = 0; row_index < datas.length; row_index++) {
      const raw_data = datas[row_index];
      const meta = callback(raw_data, row_index, parent_meta);
      this.raw_flatten_raw_keys.push(meta.key);

      const children = this.get_raw_children(raw_data);
      if (children?.length) {
        this.flatten(
          children,
          deep + 1,
          callback,
          meta
        );
      }
    }
  }

  update_row_data(raw_datas: RawData[]) {
    this.init();

    const get_row_key = this.get_row_key;
    const row_height = this.row_height;

    this.raw_raw_datas = raw_datas;
    this.raw_row_keys = raw_datas.map(get_row_key);

    // 创建行的元信息
    const _create_row_meta = (raw_data: RawData, index: number, parent_meta: Option<RowMeta>): RowMeta => {
      const deep = (parent_meta?.deep ?? -1) + 1;
      let expand_by;
      if (parent_meta) {
        expand_by = (parent_meta.expand_by ?? []);
        expand_by.push(parent_meta.key);
      }
      return {
        key: get_row_key(raw_data, index),
        index,
        deep,
        height: row_height,
        sort: `${deep}-${index}`,
        expand_by: expand_by
      }
    }

    // 单个任务
    const _task = (raw_data: RawData, index: number, parent_meta: Option<RowMeta>): RowMeta => {
      const meta = _create_row_meta(raw_data, index, parent_meta);

      const row_key = meta.key;
      this.raw_data_map_row_key.set(raw_data, row_key);
      this.row_key_map_raw_data.set(row_key, raw_data);
      this.row_key_map_row_meta.set(row_key, meta);

      return meta;
    }

    this.flatten(
      this.raw_raw_datas,
      0,
      _task,
      null
    )
  }

  /// 获取所有展开后的 key 值
  get_all_expand_keys(): RowKey[] {
    const row_keys: RowKey[] = [];
    const metas = this.row_key_map_row_meta.values();
    for (const meta of metas) {
      row_keys.push(...(meta.expand_by ?? []));
    }

    return Array.from(new Set(row_keys));
  }

  // =================== 行高 =======================
  update_row_height_by_raw_data(raw_data: RawData, height: number) {
    const row_key = this.get_row_key_by_raw_data(raw_data);

    if (row_key) {
      this.update_row_height_by_row_key(row_key, height);
    }
  }

  update_row_height_by_row_key(row_key: RowKey, height: number) {
    const meta = this.get_meta_by_row_key(row_key);

    if (!meta) {
      console.error(`[Error] Table Row: Can't find meta by: ${row_key}`);
      return;
    }
    meta.height = height;
    this.row_key_map_row_meta.set(row_key, meta);
  }

  get_row_height_by_raw_data(raw_data: RawData) {
    const row_key = this.get_row_key_by_raw_data(raw_data);

    return row_key
      ? this.get_row_height_by_row_key(row_key)
      : this.row_height;
  }

  // ============= 获取行数据 ===============
  get_row_key_by_raw_data(raw_data: RawData): Option<RowKey> {
    return this.raw_data_map_row_key.get(raw_data) ?? null;
  }
}

/// 行数据
export class RowData {
  constructor(
    readonly from: number,
    readonly to: number,
    readonly line: number,
    readonly deep: number,
    readonly raw_data: RawData,
  ) { }
}

// TODO: 来重组 Y 和 rowKey 的关系
export enum Tree {
  BranchShift = 5,
  Branch = 1 << Tree.BranchShift,
}