<script lang="ts">
import type { VNode, PropType } from "vue";
import type { RowData, RowKey, TableColumn } from "@scode/table-typing"
import type { CustomRow, ExpandIconSlot, } from "../../typing";
import { BodyCellInheritProps } from "../../typing";
import { defineComponent, h, onRenderTriggered } from "vue";
import BodyRow from "./row.vue";
import { useStateInject } from "../../hooks";

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
          bodyCell: props.bodyCell,
          transformCellText: props.transformCellText
        }
      );
    }

    onRenderTriggered((e) => {
      console.log(e)
    })

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