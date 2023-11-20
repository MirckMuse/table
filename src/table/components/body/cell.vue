<script lang="ts">
import { PropType, defineComponent, h, onMounted, ref } from "vue";
import { RowData, TableColumn } from "../../typing";
import { useStateInject } from "../../hooks";

export default defineComponent({
  name: "STableBodyCell",

  props: {
    column: { type: Object as PropType<TableColumn> },

    record: { type: Object as PropType<RowData> },

    rowIndex: { type: Number },

    isHover: { type: Boolean },
  },

  setup(props) {

    const cellRef = ref<HTMLElement>();
    const tableState = useStateInject();

    onMounted(() => {
      if (!cellRef.value) return;

      tableState?.updateRowMeta(props.rowIndex ?? -1, cellRef.value.getBoundingClientRect().height);
    })
    function getText(column?: TableColumn, record?: RowData): string | null {
      if (!record || !column?.dataIndex) return null;

      return record[column.dataIndex] as string;
    }

    return () => {
      const {
        record,
        column
      } = props

      const cellClass = {
        "s-table-body-cell": true,
        "s-table-body-cell-hover": props.isHover,
      }


      return h('div', { class: cellClass, ref: cellRef }, [getText(column, record)]);
    };
  }
})
</script>

<style lang="less" scoped>
.s-table-body-cell {
  border-top: 1px solid var(--table-border-color);
  border-bottom: transparent;
  font-style: normal;
  font-weight: 400;
  position: relative;
  padding: var(--table-body-cell-padding);
  font-size: 14px;
  line-height: 1.642857;
  overflow-wrap: break-word;
  color: var(--table-body-cell-text-color);
  transition: background-color .2s ease-in-out;
  
  &-hover {
    background-color: #F6F7FA;
  }
}
</style>