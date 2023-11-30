<script lang="ts">
import { PropType, StyleValue, defineComponent, h, onMounted, ref } from "vue";
import { RowData, TableColumn, TableColumnEllipsisObject } from "../../typing";
import { SelectionState, useStateInject } from "../../hooks";
import { get } from "lodash-es";

export default defineComponent({
  name: "STableBodyCell",

  props: {
    column: { type: Object as PropType<TableColumn>, required: true },

    record: { type: Object as PropType<RowData>, required: true },

    rowIndex: { type: Number, required: true },

    isHover: { type: Boolean },

    selectionState: { type: Object as PropType<SelectionState>, required: true },

    ellipsis: { type: Object as PropType<TableColumnEllipsisObject> }
  },

  setup(props) {

    const cellRef = ref<HTMLElement>();
    const {
      tableState
    } = useStateInject();

    onMounted(() => {
      if (!cellRef.value) return;

      tableState.value.updateRowMeta(props.rowIndex ?? -1, cellRef.value.getBoundingClientRect().height);
    })
    function getText(column?: TableColumn, record?: RowData): unknown | null {
      if (!column?.dataIndex) return null;

      return get(record, column?.dataIndex, null)
    }

    const prefixClass = "s-table-body-cell";

    function getSelectionClass() {
      const {
        column,
        selectionState,
        rowIndex
      } = props

      const { colKeys, startRowIndex, endRowIndex } = selectionState;
      if (!colKeys.length || startRowIndex === -1 || endRowIndex === -1) {
        return {}
      }

      if (column.key && colKeys.includes(column.key) && startRowIndex <= rowIndex && rowIndex <= endRowIndex) {
        const clas: Record<string, boolean> = {
          [`${prefixClass}-selection`]: true,
        }

        if (colKeys[0] === column.key) {
          clas[`${prefixClass}-selection__left`] = true
        }
        if (colKeys[colKeys.length - 1] === column.key) {
          clas[`${prefixClass}-selection__right`] = true
        }
        if (startRowIndex === rowIndex) {
          clas[`${prefixClass}-selection__top`] = true
        }
        if (endRowIndex === rowIndex) {
          clas[`${prefixClass}-selection__bottom`] = true
        }
        return clas
      }

      return {}
    }

    return () => {
      const {
        record,
        column,
        isHover,
        ellipsis,
        rowIndex,
      } = props

      const cellClass = {
        [prefixClass]: true,
        [`${prefixClass}-hover`]: isHover,
        ...getSelectionClass(),
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

.s-table-body-cell-selection.s-table-body-cell-selection {
  &__left {
    border-left-color: var(--table-body-cell-border-color-selection);
  } 
  &__right {
    border-right-color: var(--table-body-cell-border-color-selection);
  }
  &__top {
    border-top-color: var(--table-body-cell-border-color-selection);
  } 
  &__bottom {
    border-bottom-color: var(--table-body-cell-border-color-selection);
  }
}

.s-table-body-cell {
  border: 1px solid transparent;
  border-bottom-color: var(--table-border-color);
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
  user-select: none;
  
  &-hover {
    background-color: var(--table-body-cell-bg-hover);
  }

  &-selection {
    background-color: var(--table-body-cell-bg-selection);
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