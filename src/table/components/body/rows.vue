<script lang="ts">
import type { VNode } from "vue";
import { PropType, defineComponent, h } from "vue";
import { BodyCellInheritProps, CustomRow, ExpandIconSlot, RowData, RowKey, TableColumn } from "../../typing";
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
    function renderRow(columns: TableColumn[], record: RowData): VNode {
      const rowKey = (props.getRowKey?.(record) ?? record._s_row_index) as RowKey;

      return h(
        BodyRow,
        {
          key: rowKey,
          rowKey: rowKey,
          expandIcon: props.expandIcon,
          columns,
          record,
          customRow: props.customRow,
          bodyCell: props.bodyCell,
          transformCellText: props.transformCellText
        }
      );
    }

    return () => {
      const {
        columns = [],
        dataSource = []
      } = props;

      // TODO: 需要添加 key
      return dataSource.map(record => renderRow(columns, record))
    };
  }
})
</script>