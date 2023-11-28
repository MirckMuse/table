<script lang="ts">
import type { StyleValue, VNode } from "vue";
import { PropType, defineComponent, h } from "vue";
import { TableColumn, TableColumnEllipsisObject } from "../../typing";
import Cell from "./cell.vue";

export default defineComponent({
  name: "STableHeaderCells",

  props: {
    columns: { type: Array as PropType<TableColumn[]> },
  },

  setup(props) {
    // TODO: 可以考虑做个检测列检测，colSpan 相加和 大于展示行数，提示开发者
    function renderCell(column: TableColumn): VNode | null {
      if (typeof column.colSpan === "number" && column.colSpan <= 0) {
        return null;
      }

      const style: StyleValue = {};

      if (typeof column.colSpan === "number" && column.colSpan > 0) {
        style.gridColumn = `span ${column.colSpan}`;
      }

      return h(Cell, {
        column,
        style,
        ellipsis: column.ellipsis as TableColumnEllipsisObject | undefined
      })
    }

    return () => {
      const {
        columns = [],
      } = props;

      // 渲染列，需要考虑表头嵌套的情况
      return columns.map(col => renderCell(col))
    };
  }
})
</script>