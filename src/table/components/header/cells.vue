<script lang="ts">
import type { VNode } from "vue";
import { PropType, defineComponent, h } from "vue";
import { TableColumn } from "../../typing";
import Cell from "./cell.vue";

export default defineComponent({
  name: "STableHeaderCells",

  props: {
    columns: { type: Array as PropType<TableColumn[]> },
  },

  setup(props) {
    function renderCell(column: TableColumn): VNode {
      return h(Cell, { column })
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