import type { TableState } from "@scode/table-state";
import type { ITableProcessEvent, PaginationOption, TableEmit } from "../typing";

import { provide, inject, type InjectionKey, type Ref, type UnwrapRef, nextTick } from "vue";
import { Default_Page_Size } from "./usePagination";
import { noop } from "../utils";
import type { Noop } from "table-state/src/callback";

export interface ITableCallbackOption extends ITableProcessEvent {
  table_state: Ref<UnwrapRef<TableState>>,

  table_emit: TableEmit,
}

export interface TableCallback {
  onPaginationChange: Noop,
  onFilterChange: Noop,
  onSortChange: Noop,
}

const TableCallbackKey: InjectionKey<TableCallback> = Symbol("__TableCallbackKey__")

export function useProvideTableCallback(option: ITableCallbackOption) {
  const {
    table_state,
    table_emit,
    processPaginationChange,
    processFilterChange,
    processSortChange
  } = option;

  // 分页、排序、筛选后的触发 change
  function onChange() {
    const { pagination, filter_states, sorter_states, row_state } = table_state.value;
    const _option: PaginationOption = {
      page: pagination?.page ?? 1,
      size: pagination?.size ?? Default_Page_Size,
    };
    table_emit("change", {
      pagination: _option,
      filters: filter_states,
      sorter: sorter_states,
      currentDataSource: row_state.get_raw_raw_datas(),
    });
  }

  // 分页的数据回调
  function onPaginationChange() {
    nextTick(() => {
      const { pagination } = table_state.value;

      const _option: PaginationOption = {
        page: pagination?.page ?? 1,
        size: pagination?.size ?? Default_Page_Size,
      };

      table_emit('change:pagination', _option);
      onChange();
      processPaginationChange?.(_option);
    })
  }

  // 筛选后的回调
  function onFilterChange() {
    nextTick(() => {
      const { filter_states } = table_state.value;
      table_emit('change:filter', filter_states);
      onChange();
      processFilterChange?.(filter_states)
    })
  }

  function onSortChange() {
    nextTick(() => {
      const { sorter_states } = table_state.value;
      table_emit('change:sort', sorter_states);
      onChange();
      processSortChange?.(sorter_states)
    })
  }

  provide(TableCallbackKey, {
    onPaginationChange,
    onFilterChange,
    onSortChange
  })
}

export function useInjectTableCallback() {
  return inject(TableCallbackKey, {
    onPaginationChange: noop,
    onFilterChange: noop,
    onSortChange: noop,
  })
}
