<template>
  <div :class="cellClass" ref="cellRef" :title="title" v-bind="cellBind">
    <div :class="cellInnerClass" :style="cellInnerStyle" ref="cellInnerRef">
      
      <component v-if="isCustomRenderVNode" :is="customRenderResult"></component>
      <template v-else>{{ customRenderResult ?? text }}</template>
    </div>
  </div>
</template>

<script lang="ts">
import { get } from "lodash-es";
import { Fragment, PropType, StyleValue, computed, defineComponent, h, isVNode, ref } from "vue";
import { useSelectionInject, useStateInject } from "../../hooks";
import { RowData, TableColumn, TableColumnEllipsisObject } from "../../typing";

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
    const cellInnerRef = ref<HTMLElement>();

    const { selection_state } = useSelectionInject();

    const { tableState } = useStateInject();

    function getText(column?: TableColumn, record?: RowData): unknown | null {
      if (!column?.dataIndex) return null;

      return get(record, column?.dataIndex, null)
    }

    const prefixClass = "s-table-body-cell";

    function getSelectionClass() {
      const {
        column,
        rowIndex
      } = props

      const { colKeys = [], startRowIndex, endRowIndex } = selection_state || {};
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

    const isHover = computed(() => tableState.value.hoverState.rowIndex === props.rowIndex)

    const cellClass = computed(() => {
      return {
        [prefixClass]: true,
        [`${prefixClass}-hover`]: isHover.value,
        ...getSelectionClass(),
      }
    });

    const cellInnerClass = computed(() => {
      return {
        [`${prefixClass}-inner`]: true,
        [`${prefixClass}-inner-ellipsis`]: !!props.ellipsis
      }
    })

    const cellInnerStyle = computed<StyleValue>(() => {
      return {
        textAlign: props.column?.align,
      }
    });

    const text = computed(() => {
      const { column, record } = props;

      return getText(column, record)?.toString() ?? undefined;
    })

    const title = computed(() => {
      return props.ellipsis?.showTitle ? text.value : undefined
    });

    const cellBind = computed(() => {
      const { column, record, rowIndex } = props;
      return column.customCell?.(record, rowIndex, column) ?? {}
    });

    const customRenderResult = computed(() => {
      const { column, rowIndex, record } = props;
      return column.customRender?.({
        text: text.value,
        record,
        column,
        index: rowIndex
      }) ?? undefined;
    })

    const isCustomRenderVNode = computed(() => isVNode(customRenderResult.value))

    return {
      cellRef, cellClass, cellBind, title,

      cellInnerRef, cellInnerClass, cellInnerStyle, text,

      customRenderResult, isCustomRenderVNode
    }
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
  
  &-hover {
    background-color: var(--table-body-cell-bg-hover);
  }

  &-selection {
    background-color: var(--table-body-cell-bg-selection);
  }

  &-inner {
    flex: 1;
    height: fit-content;
    
    &-ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
  }
}
</style>