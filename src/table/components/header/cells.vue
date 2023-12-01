<script lang="ts">
import type { StyleValue, VNode } from "vue";
import { PropType, computed, defineComponent, h, watch } from "vue";
import { TableColumn, TableColumnEllipsisObject } from "../../typing";
import Cell from "./cell.vue";
import { useStateInject } from "../../hooks";

export default defineComponent({
  name: "STableHeaderCells",

  props: {
    columns: { type: Array as PropType<TableColumn[]> },

    type: { type: String }
  },

  setup(props) {
    const {
      tableState
    } = useStateInject();

    const scroll = computed(() => tableState.value.scroll);

    // TODO: 可以考虑做个检测列检测，colSpan 相加和 大于展示行数，提示开发者
    function renderCell(column: TableColumn): VNode | null {
      if (typeof column.colSpan === "number" && column.colSpan <= 0) {
        return null;
      }

      const style: StyleValue = {};
      if (props.type === 'center') {
        const { left: scrollLeft } = scroll.value;
        style.transform = `translateX(${-scrollLeft}px)`
      }

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
      // 渲染列，需要考虑表头嵌套的情况
      return (props.columns ?? []).map(col => renderCell(col))
    };
  }
})
</script>