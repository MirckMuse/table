import { provide, inject, InjectionKey, reactive } from "vue";
import { TableState } from "../../state";
import { TableColumn, TableColumnFixed, TableProps } from "../typing";
import { isNil } from "lodash-es"


const TableStateKey: InjectionKey<TableState> = Symbol("__TableState__");

export function useStateProvide(props: TableProps) {

  // 标准化列配置信息
  function standardizationColumn(column: TableColumn) {
    let ellipsis = column.ellipsis
    if (column.ellipsis && typeof column.ellipsis === 'boolean') {
      ellipsis = { showTitle: true };
    }

    let fixed: TableColumnFixed | undefined = undefined;
    let width = column.width;
    if (column.fixed) {
      if (typeof column.fixed === "boolean") {
        fixed = "left";
      } else {
        fixed = column.fixed;
      }
      width = column.width ?? 120;
    }

    if (typeof width === "number") {
      width = `${width}px`;
    }

    return Object.assign<TableColumn, TableColumn>(column, {
      ellipsis,
      fixed: fixed,
      width,
      colSpan: isNil(column.colSpan) ? 1 : column.colSpan
    });
  }

  function createTableState() {
    return new TableState({
      columns: (props.columns ?? []).map(standardizationColumn),

      dataSource: props.dataSource ?? []
    });
  }

  const state = reactive(createTableState())


  provide(TableStateKey, state)
}

export function useStateInject() {
  return inject(TableStateKey)
}

