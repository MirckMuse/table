import { provide, inject, InjectionKey, reactive } from "vue";
import { TableState } from "../../state";
import { TableProps } from "../typing";


const TableStateKey: InjectionKey<TableState> = Symbol("__TableState__");

export function useStateProvide(props: TableProps) {
  function createTableState() {
    return new TableState({
      columns: props.columns ?? [],

      dataSource: props.dataSource ?? []
    });
  }

  const state = reactive(createTableState())


  provide(TableStateKey, state)
}

export function useStateInject() {
  return inject(TableStateKey)
}

