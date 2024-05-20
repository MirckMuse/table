import type {
  GetRowKey,
  RowData,
  RowDataMeta,
  RowKey
} from "@scode/table-typing";
import { chunk, memoize } from "lodash-es";
import { toRaw } from "vue";
import { runIdleTask } from '@scode/table-shared';

export interface RowMeta {
  key: RowKey;

  index: number;

  deep: number;

  height: number;

  sort: string;
}

export type RowMetaOrNull = RowMeta | null;

export interface TableRowStateOption {
  row_height: number;

  is_fixed_row_height: boolean;

  get_row_key?: GetRowKey;
}

const ChunkSize = 100;

// enum CompareResult {
//   Less = -1,
//   Equal = 0,
//   Greater = 1,
// }

export class TableRowState {
  // 原始行的 keys
  private raw_row_keys: RowKey[] = [];

  // 行数据 key 映射行元数据
  private row_key_map_row_meta: Map<RowKey, RowMeta> = new Map();

  row_key_map_row_data_meta: Map<RowKey, RowDataMeta> = new Map();

  // 行数据映射行数据 key
  private row_data_map_row_key: WeakMap<RowData, RowKey> = new WeakMap();

  private row_key_map_row_data: Map<RowKey, RowData> = new Map();

  private rough_row_height: number = 56;

  private fixed_row_height: boolean = true;

  private get_row_key = ((_: RowData, rowIndex: number) => `0-${rowIndex}`) as GetRowKey;

  constructor(option: TableRowStateOption) {
    this.rough_row_height = option.row_height
    this.fixed_row_height = option.is_fixed_row_height;
    if (option.get_row_key) {
      this.get_row_key = option.get_row_key;
    }
  }

  private init() {
    this.raw_row_keys = [];
    this.row_key_map_row_data.clear();
    this.row_key_map_row_meta.clear();
    this.row_key_map_row_data_meta.clear();
    this.row_data_map_row_key = new WeakMap<RowData, RowKey>();
  }

  is_fixed_row_height() {
    return this.fixed_row_height;
  }

  get_raw_row_keys() {
    return Object.freeze(this.raw_row_keys);
  }

  get_all_row_data_metas() {
    return this.row_key_map_row_data_meta.values();
  }

  get_row_data_meta_by_row_key(row_key: RowKey): RowDataMeta | null {
    return this.row_key_map_row_data_meta.get(row_key) ?? null;
  }

  get_meta_by_row_key(row_key: RowKey): RowMetaOrNull {
    return this.row_key_map_row_meta.get(row_key) ?? null
  }

  get_meta_by_row_data(row_data: RowData): RowMetaOrNull {
    const row_key = this.row_data_map_row_key.get(row_data) ?? null;
    if (!row_key) return null;

    return this.get_meta_by_row_key(row_key);
  }

  get_row_height() {
    return this.rough_row_height;
  }

  clear_memoize() {
    this.memoize_get_row_height_by_row_key.cache.clear?.();
  }

  memoize_get_row_height_by_row_key = memoize(this.get_row_height_by_row_key);

  get_row_height_by_row_key(row_key: RowKey) {
    if (this.fixed_row_height) {
      return this.rough_row_height;
    }

    const meta = this.get_meta_by_row_key(row_key);
    return meta?.height ?? this.rough_row_height;
  }

  get_row_height_by_row_data(row_data: RowData) {
    if (this.fixed_row_height) {
      return this.rough_row_height;
    }

    const meta = this.get_meta_by_row_data(row_data);
    return meta?.height ?? this.rough_row_height;
  }

  get_row_data_by_row_key(row_key: RowKey): RowData | null {
    return this.row_key_map_row_data.get(row_key) ?? null;
  }

  update_row_height_by_row_key(row_key: RowKey, new_height: number) {
    const meta = this.get_meta_by_row_key(row_key);
    if (!meta) return;

    meta.height = new_height;
    this.row_key_map_row_meta.set(row_key, meta);
  }

  update_row_height_by_row_data(row_data: RowData, new_height: number) {
    const meta = this.get_meta_by_row_data(row_data);
    if (!meta) return;

    const row_key = this.row_data_map_row_key.get(row_data);
    if (!row_key) return;

    meta.height = new_height;
    this.row_key_map_row_meta.set(row_key, meta);

    // 更新行高的缓存
    this.memoize_get_row_height_by_row_key.cache.set(row_key, new_height);
  }

  // 更新行数据
  update_row_datas(row_datas: RowData[], done_callback?: () => void) {
    this.init();
    this.clear_memoize();

    const get_row_key = this.get_row_key;
    const raw_row_datas = toRaw(row_datas);
    this.raw_row_keys = raw_row_datas.map(get_row_key);

    const _createRowMeta = (rowKey: RowKey, index: number): RowMeta => {
      return {
        key: rowKey,
        index,
        deep: 0,
        height: this.rough_row_height,
        sort: `0-${String(index)}`,
      };
    };

    const _task = (oneChunk: RowData[], chunkIndex: number) => {
      oneChunk.forEach((row_data, index) => {
        let i = index + chunkIndex * ChunkSize;
        const row_key = get_row_key(row_data, i);
        const meta = _createRowMeta(row_key, i);
        this.row_data_map_row_key.set(row_data, row_key)
        this.row_key_map_row_meta.set(row_key, meta);
        this.row_key_map_row_data.set(row_key, row_data);
        this.row_key_map_row_data_meta.set(row_key, {
          key: row_key,
          data: toRaw(row_data)
        })
      });
    }

    if (row_datas.length > ChunkSize) {
      _task(row_datas.slice(0, ChunkSize), 0);

      // 放入微队列中，不影响第一次渲染
      setTimeout(() => {
        const chunks = chunk(row_datas, ChunkSize);

        for (let i = 1; i < chunks.length; i++) {
          runIdleTask(() => {
            _task(chunks[i], i)

            if (i === chunks.length - 1) {
              done_callback?.();
            }
          });
        }
      });
    } else {
      _task(row_datas, 0);
      done_callback?.();
    }
  }

  insert_row_meta(row_data: RowData, row_index: number, parent_row_data?: RowData): RowMeta {
    if (this.get_meta_by_row_data(row_data)) return this.get_meta_by_row_data(row_data)!;

    const row_key = this.get_row_key(row_data);
    const meta: RowMeta = {
      key: row_key,
      index: row_index,
      deep: 0,
      height: this.rough_row_height,
      sort: `0-${String(row_index)}`
    }

    if (parent_row_data) {
      const parent_meta = this.get_meta_by_row_data(parent_row_data);
      meta.deep = (parent_meta?.deep ?? -1) + 1;
      meta.sort = `${meta.deep}-${row_index}`;
    }

    this.row_data_map_row_key.set(row_data, row_key);
    this.row_key_map_row_meta.set(row_key, meta);
    this.row_key_map_row_data.set(row_key, row_data);
    this.row_key_map_row_data_meta.set(row_key, { key: row_key, data: toRaw(row_data) });

    return meta;
  }
}
