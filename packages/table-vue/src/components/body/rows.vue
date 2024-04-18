<script lang="ts">
import type { RowData, RowKey, TableColumn } from "@scode/table-typing";
import type { PropType, VNode } from "vue";
import { defineComponent, h } from "vue";
import { useStateInject } from "../../hooks";
import type { CustomRow, ExpandIconSlot, } from "../../typing";
import { BodyCellInheritProps } from "../../typing";
import BodyRow from "./row.vue";

export default defineComponent({
  name: "STableBodyRows",

  props: {
    dataSource: { type: Array as PropType<RowData[]> },

    columns: { type: Array as PropType<TableColumn[]> },

    getRowKey: { type: Function as PropType<(record: RowData) => RowKey> },

    expandIcon: { type: Function as PropType<ExpandIconSlot> },

    customRow: { type: Function as PropType<CustomRow> },

    ...BodyCellInheritProps,
  },

  setup(props) {
    const { tableState } = useStateInject();

    function renderRow(columns: TableColumn[], record: RowData): VNode {

      const rowMeta = tableState.value.rowStateCenter.getStateByRowData(record)?.getMeta()

      const hoverState = tableState.value.hoverState;

      const rowKey = rowMeta?.key ?? -1;

      return h(
        BodyRow,
        {
          key: rowKey,
          rowKey: rowKey,
          rowMeta: rowMeta,
          rowIndex: rowMeta?.index ?? -1,
          expandIcon: props.expandIcon,
          columns,
          record,
          isHover: tableState.value.hoverState.rowKey === rowKey,
          hoverState: hoverState,
          customRow: props.customRow,
          ...Object.keys(BodyCellInheritProps).reduce<Record<string, unknown>>((bind, key) => {
            bind[key] = (props as any)[key];
            return bind;
          }, {})
        }
      );
    }

    return () => {
      const {
        columns = [],
        dataSource = []
      } = props;

      return dataSource.map(record => renderRow(columns, record))
    };
  }
})
</script>