import { isNil } from "lodash-es";
import { InjectionKey, Ref, inject, provide, ref } from "vue";
import { TableState } from "../../state";
import { ColKeySplitWord } from "../config";
import { TableColumn, TableColumnFixed, TableProps } from "../typing";

interface ITableContext {
  tableState: Ref<TableState>;

  handleResizeColumn: (resizedWidth: number, column: TableColumn) => void;
}


const TableStateKey: InjectionKey<ITableContext> = Symbol("__TableState__");

export function useStateProvide(props: TableProps) {

  // 标准化列配置信息
  function standardizationColumn(column: TableColumn, index: number) {
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

    const standardColumn = Object.assign<TableColumn, TableColumn>(column, {
      key: column.key ?? [column.dataIndex, index].join(ColKeySplitWord),
      ellipsis,
      fixed: fixed,
      width,
      colSpan: isNil(column.colSpan) ? 1 : column.colSpan,
    });
    return standardColumn
  }

  function createTableState() {
    return new TableState({
      columns: (props.columns ?? []).map(standardizationColumn),

      dataSource: props.dataSource ?? []
    });
  }

  const state = ref(createTableState())

  function handleResizeColumn(resizedWidth: number, column: TableColumn) {
    props.onResizeColumn?.(resizedWidth, column);
  }

  provide(TableStateKey, {
    tableState: state,
    handleResizeColumn
  })
}

export function useStateInject() {
  return inject(TableStateKey, {
    tableState: ref(new TableState({})),
    handleResizeColumn: () => { },
  });
}

