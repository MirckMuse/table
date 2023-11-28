<script lang="ts">
import { PropType, StyleValue, defineComponent, h, onMounted, ref } from "vue";
import { RowData, TableColumn, TableColumnEllipsisObject } from "../../typing";
import { useStateInject } from "../../hooks";
import { get } from "lodash-es";

export default defineComponent({
  name: "STableBodyCell",

  props: {
    column: { type: Object as PropType<TableColumn>, required: true },

    record: { type: Object as PropType<RowData>, required: true },

    rowIndex: { type: Number, required: true },

    isHover: { type: Boolean },

    ellipsis: { type: Object as PropType<TableColumnEllipsisObject> }
  },

  setup(props) {

    const cellRef = ref<HTMLElement>();
    const tableState = useStateInject();

    onMounted(() => {
      if (!cellRef.value) return;

      tableState?.updateRowMeta(props.rowIndex ?? -1, cellRef.value.getBoundingClientRect().height);
    })
    function getText(column?: TableColumn, record?: RowData): unknown | null {
      if (!column?.dataIndex) return null;

      return get(record, column?.dataIndex, null)
    }

    const prefixClass = "s-table-body-cell";

    return () => {
      const { record, column, isHover, ellipsis, rowIndex } = props

      const cellClass = {
        [prefixClass]: true,
        [`${prefixClass}-hover`]: isHover,
      }

      const cellInnerClass = {
        [`${prefixClass}-inner`]: true,
        [`${prefixClass}-inner-ellipsis`]: !!ellipsis
      }

      const cellInnerStyle: StyleValue = {
        textAlign: column?.align,
      };

      const text = getText(column, record);

      const title = ellipsis?.showTitle ? text : undefined;

      const inner = h("div", { class: cellInnerClass, style: cellInnerStyle }, [text?.toString() ?? null]);

      const cellBind = column.customCell?.(record, rowIndex, column) ?? {};

      return h('div', { class: cellClass, ref: cellRef, title, ...cellBind }, inner);
    };
  }
})
</script>

<style lang="less" scoped>
.s-table-body-cell {
  border-bottom: 1px solid var(--table-border-color);
  font-style: normal;
  font-weight: 400;
  position: relative;
  padding: var(--table-body-cell-padding);
  font-size: 14px;
  line-height: 1.642857;
  overflow-wrap: break-word;
  color: var(--table-body-cell-text-color);
  transition: background-color .2s ease-in-out;
  background-color: #FFF;

  display: inline-flex;
  min-width: 0;
  align-items: center;
  
  &-hover {
    background-color: #F6F7FA;
  }

  &-inner {
    flex: 1;
    
    &-ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
  }
}
</style>