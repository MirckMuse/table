import { InjectionKey, Ref, inject, provide, ref, watch } from "vue";
import { TableState } from "../../state";
import { TableColumn, TableProps } from "../typing";
import { debounce, isObject } from "lodash-es";
import { noop } from "../utils/shared";
import { useCellTooltip } from "./useCellTooltip";

interface ITableContext {
  tableState: Ref<TableState>;

  tableProps: TableProps;

  slots: Record<string, any>;

  handleResizeColumn: (resizedWidth: number, column: TableColumn) => void;

  // cell 的移入和移出逻辑
  handleTooltipEnter: (cellEl: HTMLElement) => void;
  handleTooltipLeave: ($event: MouseEvent) => void;
}


const TableStateKey: InjectionKey<ITableContext> = Symbol("__TableState__");

interface IStateOption {
  props: TableProps;

  slots: Record<string, any>;

  tableRef: Ref<HTMLElement | undefined>
}

export function useStateProvide({
  props,
  tableRef,
  slots
}: IStateOption) {

  function createTableState() {
    return new TableState({
      columns: props.columns ?? [],
      dataSource: props.dataSource ?? []
    });
  }

  const state = ref(createTableState());

  watch(
    () => props.dataSource ?? [],
    (dataSource) => {
      state.value.coverDataSource(dataSource)
    }
  )

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

  const { handleTooltipEnter, handleTooltipLeave } = useCellTooltip({
    tooltipVisible(cellEl: HTMLElement) {
      const colKey = cellEl.dataset.colKey ?? "";
      const column = state.value.columnMap[colKey];
      return !!(isObject(column.ellipsis) && column.ellipsis.showTooltip)
    }
  })

  provide(TableStateKey, {
    tableState: state,
    slots,
    handleResizeColumn,
    tableProps: props,
    handleTooltipEnter,
    handleTooltipLeave
  })
}

export function useStateInject() {
  return inject(TableStateKey, {
    tableState: ref(),
    slots: {},
    handleResizeColumn: noop,
    tableProps: {},
    handleTooltipEnter: noop,
    handleTooltipLeave: noop
  });
}

