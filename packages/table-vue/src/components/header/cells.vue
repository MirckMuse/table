<script lang="ts">
import type { TableColumn, TableColumnEllipsisObject } from "@scode/table-typing";
import type { PropType, StyleValue, VNode } from "vue";
import { defineComponent, h } from "vue";
import { useStateInject } from "../../hooks";
import Cell from "./cell.vue";

export default defineComponent({
  name: "STableHeaderCells",

  props: {
    columns: { type: Array as PropType<TableColumn[]>, required: true },

    flattenColumns: { type: Array as PropType<TableColumn[]>, required: true },

    type: { type: String }
  },

  setup(props) {
    const { tableState } = useStateInject();

    const colStateCenter = tableState.value.colStateCenter;

    // TODO: 可以考虑做个检测列检测，colSpan 相加和 大于展示行数，提示开发者
    function renderCell(column: TableColumn): VNode | null {
      if (typeof column.colSpan === "number" && column.colSpan <= 0) {
        return null;
      }

      const style: StyleValue = {};

      const {
        rowSpan = 1,
        colSpan = 1,
        isLeaf,
        key
      } = colStateCenter.getStateByColumn(column)?.getMeta() || {};

      style.gridColumn = `span ${colSpan}`;
      style.gridRow = `span ${rowSpan}`;

      const dataset: any = { "data-col-key": key };
      if (isLeaf) {
        dataset["data-isLeaf"] = "true"
      }

      return h(
        Cell,
        {
          column,
          style,
          ellipsis: column.ellipsis as TableColumnEllipsisObject | undefined,
          ...dataset
        }
      )
    }

    return () => {
      return props.flattenColumns?.map(renderCell)
    };
  }
})
</script>