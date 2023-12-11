<script lang="ts">
import type { StyleValue, VNode } from "vue";
import { PropType, computed, defineComponent, h } from "vue";
import { useStateInject } from "../../hooks";
import { TableColumn, TableColumnEllipsisObject, TableColumnMeta } from "../../typing";
import Cell from "./cell.vue";
import { isNestColumn } from "../../utils";

export default defineComponent({
  name: "STableHeaderCells",

  props: {
    columns: { type: Array as PropType<TableColumn[]>, required: true },

    flattenColumns: { type: Array as PropType<TableColumn[]>, required: true },

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
        let colSpan = column.colSpan ?? 1;
        if ((column._s_meta?.colSpan ?? 1) > 1) {
          colSpan = column._s_meta?.colSpan ?? 1
        }
        style.gridColumn = `span ${colSpan}`;
        style.gridRow = `span ${column._s_meta?.rowSpan}`;
      }

      return h(Cell, {
        column,
        style,
        ellipsis: column.ellipsis as TableColumnEllipsisObject | undefined
      })
    }

    return () => {
      return props.flattenColumns?.map(renderCell)
    };
  }
})
</script>