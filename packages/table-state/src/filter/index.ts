import type { FilterState, RowData, RowKey, TableColumn } from "@scode/table-typing";

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

  get_filtered_row_data_metas(row_datas: RowData[], filter_states: FilterState[]): RowKey[] {
    // TODO: 需要考虑怎么同级排序
    if (!filter_states.length) {
      return row_datas.map(row_data => row_data.__SCode_Row_Key__);
    }

    const new_sorter_states = filter_states.map(state => {
      const filter_keys = state.filter_keys?.map(key => String(key));
      const column = this.get_column_by_filter_state(state)

      return Object.assign(
        {},
        state,
        {
          column: this.get_column_by_filter_state(state),
          filter_keys: filter_keys,
          need_filter: filter_keys?.length && column?.filter?.onFilter
        }
      )
    });

    return new_sorter_states
      .reduce<RowData[]>((filteredRowDatas, filterState) => {
        if (filterState.need_filter) {
          const { filter_keys, column } = filterState;

          const onFilter = column?.filter?.onFilter;

          return filteredRowDatas.filter((row_data) => {
            return filter_keys!.some((key) => {
              const raw_data = row_data.__SCode_Origin_Data__;
              if (!raw_data) {
                return false;
              }
              return onFilter!(key as string, raw_data);
            })
          });
        }

        return filteredRowDatas;
      }, row_datas).map(data => data.__SCode_Row_Key__);
  }
}