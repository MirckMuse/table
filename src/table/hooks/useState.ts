import { InjectionKey, Ref, inject, provide, ref } from "vue";
import { TableState } from "../../state";
import { TableColumn, TableProps } from "../typing";
import { debounce } from "lodash-es";

interface ITableContext {
  tableState: Ref<TableState>;

  handleResizeColumn: (resizedWidth: number, column: TableColumn) => void;
}


const TableStateKey: InjectionKey<ITableContext> = Symbol("__TableState__");

export function useStateProvide(props: TableProps, tableRef: Ref<HTMLElement | undefined>) {

  function createTableState() {
    return new TableState({
      columns: props.columns ?? [],
      dataSource: props.dataSource ?? []
    });
  }

  const state = ref(createTableState());

  let userSelectState = {
    pre: "",
    isSet: false,
  };
  const revertTableUserSelect = debounce(() => {
    userSelectState.isSet = false;
    if (!tableRef.value) return;
    tableRef.value.style.userSelect = userSelectState.pre;
  }, 60);

  function handleResizeColumn(resizedWidth: number, column: TableColumn) {
    if (!userSelectState.isSet && tableRef.value) {
      userSelectState.pre = tableRef.value.style.userSelect ?? "";
      userSelectState.isSet = true;
      tableRef.value.style.userSelect = "none";
    }

    props.onResizeColumn?.(resizedWidth, column);
    revertTableUserSelect();
  }

  provide(TableStateKey, {
    tableState: state,
    handleResizeColumn
  })
}

export function useStateInject() {
  return inject(TableStateKey, {
    tableState: ref(),
    handleResizeColumn: () => { },
  });
}

