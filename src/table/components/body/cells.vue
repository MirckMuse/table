<script lang="ts">
import type { StyleValue, VNode } from "vue";
import { PropType, defineComponent, h } from "vue";
import { RowData, TableColumn, TableColumnEllipsisObject } from "../../typing";
import Cell from "./cell.vue"

export default defineComponent({
  name: "STableBodyCells",

  props: {
    dataSource: { type: Array as PropType<RowData[]> },

    columns: { type: Array as PropType<TableColumn[]> },

    gridStyle: { type: Object as PropType<StyleValue> },

    hoverRowIndex: { type: Number }
  },

  setup(props) {
    function renderCell(column: TableColumn, record: RowData, rowIndex: number): VNode {
      const isHover = props.hoverRowIndex === rowIndex;
      return h(
        Cell,
        {
          column,
          record,
          isHover,
          ellipsis: column.ellipsis as TableColumnEllipsisObject | undefined,
          rowIndex,
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