<script lang="ts">
import type { StyleValue, VNode } from "vue";
import { PropType, computed, defineComponent, h } from "vue";
import { RowData, TableColumn, TableColumnEllipsisObject } from "../../typing";
import Cell from "./cell.vue";
import { useSelectionInject, useStateInject } from "../../hooks"

export default defineComponent({
  name: "STableBodyCells",

  props: {
    dataSource: { type: Array as PropType<RowData[]> },

    columns: { type: Array as PropType<TableColumn[]> },

    gridStyle: { type: Object as PropType<StyleValue> },

    hoverRowIndex: { type: Number },

    type: { type: String }
  },

  setup(props) {
    const { selection_state } = useSelectionInject();

    const {
      tableState
    } = useStateInject();

    const scroll = computed(() => tableState.value.scroll)

    function renderCell(column: TableColumn, record: RowData, rowIndex: number): VNode {
      const cellStyle: StyleValue = {};
      const { left: scrollLeft, top: scrollTop } = scroll.value;
      if (props.type === 'center') {
        cellStyle.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`
      } else {
        cellStyle.transform = `translateY(${-scrollTop}px)`
      }
      const isHover = props.hoverRowIndex === rowIndex;
      return h(
        Cell,
        {
          column,
          record,
          isHover,
          style: cellStyle,
          ellipsis: column.ellipsis as TableColumnEllipsisObject | undefined,
          rowIndex,
          selectionState: selection_state,
          "data-col-index": column.dataIndex,
          "data-row-index": rowIndex,
          "data-type": "cell"
        }
      );
    }

    return () => {
      const {
        columns = [],
        dataSource = []
      } = props;

      return dataSource.reduce<VNode[]>((cells, rowData, rowIndex) => {
        return cells.concat(columns.map(col => renderCell(col, rowData, rowIndex)));
      }, [])
    };
  }
})
</script>