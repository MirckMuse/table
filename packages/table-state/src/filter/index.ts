import type { FilterState, RowData, RowKey, TableColumn } from "@scode/table-typing";
import { toRaw } from "vue";

type TableColumnOrNull = TableColumn | null;

interface TableFilterStateOption {
  get_column_by_filter_state: (filter_state: FilterState) => TableColumnOrNull,
  get_row_data_by_row_key: (row_key: RowKey) => RowData | null,
}

export class TableFilterState {
  get_column_by_filter_state: (filter_state: FilterState) => TableColumnOrNull;
  get_row_data_by_row_key: (row_key: RowKey) => RowData | null;

  constructor(option: TableFilterStateOption) {
    this.get_column_by_filter_state = option.get_column_by_filter_state;
    this.get_row_data_by_row_key = option.get_row_data_by_row_key;
  }

  get_filtered_row_data_metas(row_keys: RowKey[], filter_states: FilterState[]): RowKey[] {
    if (!filter_states.length) {
      return row_keys;
    }

    const new_sorter_states = filter_states.map(state => {
      return Object.assign({}, state, { column: this.get_column_by_filter_state(state) })
    });

    return new_sorter_states
      .reduce<RowKey[]>((filteredRowKeys, filterState) => {
        const { filter_keys, column } = filterState;

        const onFilter = column?.filter?.onFilter;

        if (filter_keys?.length && onFilter) {
          return filteredRowKeys.filter((row_key) => filter_keys.some((key) => {
            const row_data = toRaw(this.get_row_data_by_row_key(row_key));
            if (!row_data) {
              return false;
            }
            return onFilter(String(key), row_data);
          }));
        }

        return filteredRowKeys;
      }, row_keys)
  }
}