<script lang="ts">
import type { RowData, RowKey, TableColumn } from "@scode/table-typing";
import type { PropType, VNode } from "vue";
import { defineComponent, h } from "vue";
import { useStateInject } from "../../hooks";
import type { CustomRow, ExpandIconSlot } from "../../typing";
import { BodyCellInheritProps } from "../../typing";
import BodyRow from "./row.vue";
import type { HoverState } from "@scode/table-state";

export default defineComponent({
  name: "STableBodyRows",

  props: {
    dataSource: { type: Array as PropType<RowData[]> },

    columns: { type: Array as PropType<TableColumn[]> },

    getRowKey: { type: Function as PropType<(record: RowData) => RowKey> },

    expandIcon: { type: Function as PropType<ExpandIconSlot> },

    customRow: { type: Function as PropType<CustomRow> },

    grid: { type: Array as PropType<number[]> },

    ...BodyCellInheritProps,
  },

  setup(props) {
    const { tableState } = useStateInject();

    function renderRow(columns: TableColumn[], record: RowData, hoverState: HoverState): VNode {
      const rowMeta =
        tableState.value.row_state.get_meta_by_row_data(record) ?? undefined;

      const rowKey = rowMeta?.key ?? -1;

      return h(BodyRow, {
        key: rowKey,
        rowKey: rowKey,
        rowMeta: rowMeta,
        rowIndex: rowMeta?.index ?? -1,
        expandIcon: props.expandIcon,
        columns,
        record,
        grid: props.grid,
        isHover: hoverState.rowKey === rowKey.toString(),
        hoverState: hoverState,
        customRow: props.customRow,
        ...Object.keys(BodyCellInheritProps).reduce<Record<string, unknown>>(
          (bind, key) => {
            bind[key] = (props as any)[key];
            return bind;
          },
          {},
        ),
      });
    }

    return () => {
      const { columns = [], dataSource = [] } = props;

      const { hoverState } = tableState.value;

      console.log(hoverState);

      return dataSource.map((record) => renderRow(columns, record, hoverState));
    };
  },
});
</script>
