import type { ColKey, RowDataMeta, RowKey, SorterState, TableColumn } from "@scode/table-typing";
import { SorterDirection } from "@scode/table-typing";
import { get, memoize } from "lodash-es";
import SorterWorkder from "./worker?worker";


type TableColumnOrNull = TableColumn | null;

enum CompareResult {
  Less = -1,
  Equal = 0,
  Greater = 1,
}

interface TableSorterStateOption {
  get_column_by_sorter_state: (sorter_state: SorterState) => TableColumnOrNull,
}

export class TableSorterState {
  get_column_by_sorter_state: (sorter_state: SorterState) => TableColumnOrNull;

  get_sorter_rate: (direction?: SorterDirection) => number = memoize((direction?: SorterDirection) => {
    if (direction === SorterDirection.Ascend) {
      return 1;
    }
    if (direction === SorterDirection.Descend) {
      return -1;
    }

    return 0;
  })

  worker: Worker;

  constructor(option: TableSorterStateOption) {
    this.get_column_by_sorter_state = option.get_column_by_sorter_state;

    this.worker = new SorterWorkder();
  }

  get_sorted_row_data_metas(row_keys: RowKey[], sorter_states: SorterState[]): RowKey[] {
    const new_sorter_states = sorter_states.map(state => {
      return Object.assign({}, state, { column: this.get_column_by_sorter_state(state) })
    });

    const get_order = memoize((row_key: RowKey, col_key: ColKey) => {
      return this.get_order_map(row_key).get(col_key) ?? -Infinity;
    });

    return row_keys.sort((prev, next) => {
      for (const state of new_sorter_states) {
        const prev_order = get_order(prev, state.col_key);
        const next_order = get_order(next, state.col_key);
        const rate = this.get_sorter_rate(state.direction);
        if (prev_order !== next_order) {
          return (prev_order - next_order) * rate;
        }
      }

      return CompareResult.Equal;
    });
  }

  private meta: Map<RowKey, Map<ColKey, number>> = new Map();

  get_order_map(row_key: RowKey): Map<ColKey, number> {
    return this.meta.get(row_key) ?? new Map();
  }

  // 初始化排序的元信息。
  init_sorter_metas(row_data_metas: RowDataMeta[], last_column: (TableColumn & { col_key: ColKey })[]) {
    return new Promise<void>((resolve) => {
      this.worker.postMessage({
        metas: row_data_metas,
        columns: last_column.map(column => ({ col_key: column.col_key, dataIndex: column.dataIndex, sorter: !!column.sorter }))
      })
      this.worker.onmessage = ($event: MessageEvent) => {
        this.meta = $event.data;
        this.worker.terminate();
        resolve()
      }
    })

    // this.pool.terminate();
    // return this.pool
    //   .exec(
    //     _process,
    //     [row_data_metas, last_column.map(column => ({ col_key: column.col_key, dataIndex: column.dataIndex, sorter: !!column.sorter }))]
    //   )
    //   .then((meta_map) => {
    //     this.meta = meta_map;
    //     this.pool.terminate();
    //   })
  }

  update_sorter_meta(row_data_meta: RowDataMeta, last_column: (TableColumn & { col_key: ColKey })[]) {
    const _map = this.meta.get(row_data_meta.key) ?? new Map();

    const sorter_columns = last_column.filter(column => column.sorter);

    sorter_columns.forEach(_meta => {
      const { col_key, dataIndex } = _meta;

      const value = dataIndex
        ? get(row_data_meta.data, dataIndex, 0) as unknown
        : 0;

      if (value === null || value === undefined) {
        _map.set(col_key, 0)
      } else if (typeof value === 'number') {
        _map.set(col_key, value)
      } else if (typeof value === 'string') {
        _map.set(col_key, [...value].reduce((v, char) => v + char.charCodeAt(0), 0))
      } else {
        _map.set(col_key, Infinity)
      }
    });

    this.meta.set(row_data_meta.key, _map);
  }
}