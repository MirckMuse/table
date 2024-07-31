import type {
  GetRowKey,
  RawData,
  RowData,
  RowKey
} from "@scode/table-typing";
import { toRaw } from "vue";

export interface RowMeta {
  key: RowKey;

  index: number;

  deep: number;

  height: number;

  sort: string;

  // 展开的依赖值
  expand_by?: RowKey[]
}

export type RowMetaOrNull = RowMeta | null;

export interface TableRowStateOption {
  row_height: number;

  is_fixed_row_height: boolean;

  get_row_key?: GetRowKey;

  row_children_name?: string;
}

export class TableRowState {
  is_fixed_row_height() {
    return this.fixed_row_height;
  }

  get_raw_row_keys() {
    return this.raw_row_keys;
  }

  get_raw_row_datas() {
    return this.raw_row_datas;
  }

  clear_memoize() {
  }

  // ============= 新的方式 ============
  row_children_name = "children";

  // 原始行的 keys
  private raw_row_keys: RowKey[] = [];

  private raw_row_datas: RowData[] = [];

  private raw_raw_datas: RawData[] = [];

  private rough_row_height: number = 56;

  private fixed_row_height: boolean = true;

  private raw_flatten_row_datas: RowData[];

  // 行数据 key 映射行元数据
  private row_key_map_row_meta: Map<RowKey, RowMeta> = new Map();

  // 行数据映射行数据 key
  private raw_data_map_row_key: WeakMap<RawData, RowKey> = new WeakMap();

  row_key_map_row_data: Map<RowKey, RowData> = new Map();

  constructor(option: TableRowStateOption) {
    this.rough_row_height = option.row_height
    this.fixed_row_height = option.is_fixed_row_height;
    if (option.get_row_key) {
      this.get_row_key = option.get_row_key;
    }

    if (option.row_children_name) {
      this.row_children_name = option.row_children_name;
    }


    this.before_init();
  }


  private init() {
    this.raw_row_keys = [];
    this.raw_flatten_row_datas = [];
    this.raw_row_datas = [];
    this.raw_raw_datas = [];

    this.row_key_map_row_data.clear();
    this.row_key_map_row_meta.clear();
    this.raw_data_map_row_key = new WeakMap();
  }

  before_init() {
    this.init_get_row_height();
  }

  init_get_row_height() {
    this.get_row_height_by_row_key = this.fixed_row_height
      ? () => this.rough_row_height
      : (row_key: RowKey) => {
        const meta = this.get_meta_by_row_key(row_key);
        return meta?.height ?? this.rough_row_height;
      };
  }

  get_row_height_by_row_key: (row_key: RowKey) => number;

  get_row_key = ((_: RawData, rowIndex: number) => `0-${rowIndex}`) as GetRowKey;

  get_raw_flatten_row_datas() {
    return this.raw_flatten_row_datas;
  }

  get_raw_raw_datas() {
    return this.raw_raw_datas;
  }

  // 更新行数据
  update_row_datas(row_datas: RawData[]) {
    this.init();
    this.clear_memoize();

    const get_row_key = this.get_row_key;
    this.raw_raw_datas = toRaw(row_datas)
    this.raw_row_keys = this.raw_raw_datas.map(get_row_key);

    const _createRowMeta = (rowData: RowData): RowMeta => {
      const {
        __SCode_Row_Deep__: deep,
        __SCode_Row_Index__: index,
        __SCode_Row_Key__: rowKey,
        __SCode_Expand_Keys__
      } = rowData;

      return {
        key: rowKey,
        index,
        deep: deep,
        height: this.rough_row_height,
        sort: `${deep}-${String(index)}`,
        expand_by: __SCode_Expand_Keys__
      };
    };

    const _task = (row_data: RowData) => {
      const {
        __SCode_Row_Key__: row_key,
        __SCode_Origin_Data__: raw_data
      } = row_data;
      const meta = _createRowMeta(row_data);

      if (!row_data.__SCode_Expand_Keys__) {
        this.raw_row_datas.push(row_data)
      }

      this.raw_data_map_row_key.set(raw_data, row_key);
      this.row_key_map_row_meta.set(row_key, meta);
      this.row_key_map_row_data.set(row_key, row_data);
    }

    this.flatten_row_datas(
      this.raw_raw_datas,
      0,
      [],
      row_data => _task(row_data),
    );
  }

  // 获取行数据的子数据
  get_children(raw_data: RawData): RawData[] | null {
    const children = raw_data[this.row_children_name];
    if (Array.isArray(children)) {
      return children as RawData[];
    }

    return null;
  }

  // 扁平化数据
  flatten_row_datas(
    datas: RawData[],
    deep = 0,
    expand_keys?: RowKey[],
    callback?: (row_data: RowData) => void,
  ) {
    for (let row_index = 0; row_index < datas.length; row_index++) {
      const raw_data = datas[row_index];
      const row_data = {} as RowData;
      row_data.__SCode_Origin_Data__ = raw_data;
      row_data.__SCode_Row_Key__ = this.get_row_key(raw_data, row_index);
      row_data.__SCode_Row_Index__ = row_index;
      row_data.__SCode_Row_Deep__ = deep;
      row_data.__SCode_Expand_Keys__ = expand_keys;
      this.raw_flatten_row_datas.push(row_data);

      callback?.(row_data);

      const children = this.get_children(raw_data);
      if (children?.length) {
        this.flatten_row_datas(
          children,
          deep + 1,
          (expand_keys ?? []).concat(row_data.__SCode_Row_Key__),
          callback,
        );
      }
    }
  }

  // 获取所有展开的 keys
  get_all_expand_keys(): RowKey[] {
    const row_key: RowKey[] = [];

    const _raw_flatten_row_datas = this.raw_flatten_row_datas;

    for (let i = 0; i < _raw_flatten_row_datas.length; i++) {
      const row_data = _raw_flatten_row_datas[i];

      const expand_keys = row_data?.__SCode_Expand_Keys__;

      if (expand_keys?.length) {
        row_key.push(...expand_keys)
      }
    }

    return Array.from(new Set(row_key));
  }

  // =================== 行高 =======================
  update_row_height_by_row_data(row_data: RowData, new_height: number) {
    this.update_row_height_by_row_key(row_data.__SCode_Row_Key__, new_height);
  }

  update_row_height_by_raw_data(raw_data: RawData, new_height: number) {
    const meta = this.get_meta_by_row_data(raw_data);
    if (!meta) return;

    const row_key = this.raw_data_map_row_key.get(raw_data);
    if (!row_key) return;

    meta.height = new_height;
    this.row_key_map_row_meta.set(row_key, meta);
  }

  update_row_height_by_row_key(row_key: RowKey, new_height: number) {
    const meta = this.get_meta_by_row_key(row_key);
    if (!meta) return;

    meta.height = new_height;
    this.row_key_map_row_meta.set(row_key, meta);
  }

  get_row_height_by_row_data(row_data: RowData) {
    if (this.fixed_row_height) {
      return this.rough_row_height;
    }

    const meta = this.get_meta_by_row_data(row_data);
    return meta?.height ?? this.rough_row_height;
  }

  get_row_height() {
    return this.rough_row_height;
  }

  // ============= 获取行数据 ===============
  get_row_data_by_row_key(row_key: RowKey): RowData | null {
    return this.row_key_map_row_data.get(row_key) ?? null;
  }

  // =========  获取行元数据 ==============
  get_meta_by_row_data(raw_data: RawData): RowMetaOrNull {
    const row_key = this.raw_data_map_row_key.get(toRaw(raw_data)) ?? null;
    if (!row_key) return null;

    return this.get_meta_by_row_key(row_key);
  }

  get_meta_by_row_key(row_key: RowKey): RowMetaOrNull {
    return this.row_key_map_row_meta.get(row_key) ?? null
  }
}
