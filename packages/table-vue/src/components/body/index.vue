<template>
  <div v-resize:height ref="bodyRef" class="s-table-body" :class="bodyClass" :style="bodyStyle">
    <div class="s-table-body__inner" ref="bodyInnerRef" @mouseover="handleMouseenter" @mouseout="handleMouseleave">
      <template v-if="!isEmpty">
        <div v-if="leftColumnsVisible" ref="bodyLeftRef" class="s-table-body__inner-fixedLeft s-table-fixedLeft"
          :class="{ 'shadow': scroll.left > 0 }" :style="leftStyle">
          <body-rows :grid="leftGrid" :columns="leftColumns" v-bind="commonRowProps" />
        </div>

        <div ref="bodyCenterRef" class="s-table-body__inner-center" :style="centerStyle">
          <body-rows :grid="centerGrid" :columns="centerColumns" v-bind="commonRowProps" />
        </div>

        <div v-if="rightColumnsVisible" ref="bodyRightRef" class="s-table-body__inner-fixedRight s-table-fixedRight"
          :class="{ 'shadow': scroll.left < maxXMove }" :style="rightStyle">
          <body-rows :grid="rightGrid" :columns="rightColumns" v-bind="commonRowProps" />
        </div>
      </template>

      <div v-else class="s-table-body__empty">
        <AEmpty></AEmpty>
      </div>
    </div>

    <Scrollbar v-if="!isEmpty" :state="scrollState" :client="viewport.get_height()"
      :content="viewport.get_content_height()" v-model:scroll="scroll.top" :is-vertical="true"
      @update:scroll="handleVerticalScrollChange" />

    <Scrollbar :state="scrollState" :client="viewport.get_width()" :content="viewport.get_content_width()"
      v-model:scroll="scroll.left" />
  </div>
</template>

<script lang="ts">
import type { OuterRowMeta } from "@scode/table-state";
import type { ColKey, RowData, TableColumn } from "@scode/table-typing";
import { Empty as AEmpty } from "ant-design-vue";
import type { StyleValue } from "vue";
import {
  computed,
  defineComponent,
  onUnmounted,
  onUpdated,
  reactive, ref, shallowRef,
  toRef
} from "vue";
import { resize } from "../../directives";
import { useBBox, useStateInject, useTableBodyScroll } from "../../hooks";
import { genColumnGrid, px2Number } from "../../utils";
import Scrollbar from "../scrollbar/index.vue";
import BodyRows from "./rows.vue";

export default defineComponent({
  name: "STableBody",

  directives: {
    resize
  },

  components: {
    BodyRows,
    Scrollbar,
    AEmpty
  },

  setup() {
    const {
      tableState,
      tableProps,
      slots: tableSlots,
      handleTooltipEnter,
      handleTooltipLeave,
      getRowKey
    } = useStateInject();

    const bodyCommonStyle = ref({
      transform: `translateY(0)`,
      transformCenter: `translate(0, 0)`,
      paddingTop: '0'
    })
    function updateBodyCommonStyle() {
      const { scroll } = tableState.value;
      Object.assign(bodyCommonStyle.value, {
        transform: `translateY(${-scroll.top}px)`,
        transformCenter: `translate(${-scroll.left}px, ${-scroll.top}px)`,
        paddingTop: tableState.value.get_viewport_offset_top() + 'px',
      })
    }

    tableState.value.add_scroll_callback(updateBodyCommonStyle);
    onUnmounted(() => {
      tableState.value.remove_scroll_callback(updateBodyCommonStyle);
    })

    function handleVerticalScrollChange() {
      tableState.value.updateScroll(0, 0);
    }

    const scrollState = computed(() => {
      const {
        mode = "always",
        position = "outer",
        size = 6
      } = tableProps.scroll ?? {};
      return {
        mode,
        position,
        size
      }
    })

    const dataSource = ref<RowData[]>([]);
    function getViewportDataSource() {
      dataSource.value = tableState.value.get_viewport_row_datas();
    }
    tableState.value.add_scroll_callback(getViewportDataSource);
    onUnmounted(() => {
      tableState.value.remove_scroll_callback(getViewportDataSource);
    })

    const gridTemplateRows = computed(() => {
      return tableState.value.get_row_heights_by_row_datas(dataSource.value).map(height => height + 'px').join(" ");
    })

    function getColWidth(column: TableColumn) {
      return tableState.value.colStateCenter.getColWidthByColumn(column);
    }

    const leftColumns = computed(() => {
      const colStateCenter = tableState.value.colStateCenter;

      return _map2Columns(colStateCenter.lastLeftColKeys);
    });


    const leftWidth = computed(() => {
      return tableState.value.colStateCenter.lastLeftColKeys.reduce((width, colKey) => {
        return width + tableState.value.colStateCenter.getColWidthByColKey(colKey);
      }, 0)
    });

    const leftGrid = computed(() => {
      return genColumnGrid(leftColumns.value, getColWidth, leftWidth.value).map(meta => meta.width)
    });


    const rightWidth = computed(() => {
      return tableState.value.colStateCenter.lastRightColKeys.reduce((width, colKey) => {
        return width + tableState.value.colStateCenter.getColWidthByColKey(colKey);
      }, 0)
    });

    const centerWidth = computed(() => {
      return tableState.value.viewport.get_width() - leftWidth.value - rightWidth.value;
    });

    function _map2Columns(colKeys: ColKey[]) {
      const colStateCenter = tableState.value.colStateCenter;

      return colKeys.reduce<TableColumn[]>((columns, colKey) => {
        const column = colStateCenter.getColumnByColKey(colKey);
        if (column) {
          columns.push(column);
        }

        return columns;
      }, [])
    }

    const leftColumnsVisible = computed(() => leftColumns.value.length);
    const leftStyle = computed<StyleValue>(() => {
      const { transform, paddingTop } = bodyCommonStyle.value;
      const style: StyleValue = { transform, paddingTop }
      style.gridTemplateRows = gridTemplateRows.value;
      return style;
    });

    function createGetCellPadding() {
      const padding = {
        top: -1,
        bottom: -1
      }

      return function (el: HTMLElement) {
        if (padding.top >= 0 && padding.bottom >= 0) {
          return padding;
        }
        const { paddingTop, paddingBottom } = window.getComputedStyle(el)
        padding.top = px2Number(paddingTop);
        padding.bottom = px2Number(paddingBottom);
        return padding;
      }
    }

    const getCellPadding = createGetCellPadding();

    if (!tableState.value.row_state.is_fixed_row_height()) {
      onUpdated(() => {
        const innserElements = (bodyRef.value?.querySelectorAll(".s-table-body-cell-inner") ?? []) as HTMLElement[];
        const metas: OuterRowMeta[] = [];
        for (const element of innserElements) {
          const cellElement = element.parentElement as HTMLElement;
          const { top, bottom } = getCellPadding(cellElement)
          const { rowKey } = cellElement.dataset
          metas.push({
            // 以行的索引作为 key 值。
            rowKey: rowKey!,
            height: Math.floor(element.getBoundingClientRect().height) + top + bottom
          })
        }
        tableState.value.update_row_metas(metas);
      });
    }

    const rightColumns = computed(() => {
      const colStateCenter = tableState.value.colStateCenter;

      return _map2Columns(colStateCenter.lastRightColKeys);
    });

    const rightGrid = computed(() => {
      return genColumnGrid(rightColumns.value, getColWidth, rightWidth.value).map(meta => meta.width)
    });

    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const { transform, paddingTop } = bodyCommonStyle.value;
      const style: StyleValue = { transform, paddingTop }
      style.gridTemplateRows = gridTemplateRows.value;
      return style;
    });

    const bodyRef = ref<HTMLElement>();
    const bodyInnerRef = shallowRef<HTMLElement>();

    const viewport = toRef(tableState.value, 'viewport');
    const scroll = toRef(tableState.value, 'scroll');

    const bodyClass = computed(() => {
      const clas: string[] = [];
      if (scrollState.value.mode === "hover") {
        clas.push("s-table-body__scrollbar-hover")
      }
      return clas;
    });
    const bodyStyle = computed(() => {
      return {};
    });

    // 控制表体滚动逻辑
    useTableBodyScroll(bodyInnerRef, tableState, getViewportDataSource);

    const bodyLeftRef = shallowRef<HTMLElement>();
    const bodyRightRef = shallowRef<HTMLElement>();
    const bodyCenterRef = shallowRef<HTMLElement>();

    const { bbox: bodyLeftBBox } = useBBox(bodyLeftRef);
    const { bbox: bodyRightBBox } = useBBox(bodyRightRef);

    const centerColumns = computed(() => {
      const colStateCenter = tableState.value.colStateCenter;

      return _map2Columns(colStateCenter.lastCenterColKeys);
    });

    const centerGrid = computed(() => {
      return genColumnGrid(centerColumns.value, getColWidth, centerWidth.value).map(meta => meta.width);
    });

    const centerStyle = computed(() => {
      const { transformCenter, paddingTop } = bodyCommonStyle.value;
      const style: StyleValue = { transform: transformCenter, paddingTop }
      style.paddingLeft = (bodyLeftBBox.value?.width ?? 0) + 'px'
      style.paddingRight = (bodyRightBBox.value?.width ?? 0) + 'px'
      style.gridTemplateRows = gridTemplateRows.value;
      return style;
    });

    function handleMouseenter($event: MouseEvent) {
      let target: HTMLElement | null = $event.target as HTMLElement;

      while (target) {
        if (target.dataset["type"] === "cell") {
          const { rowIndex, rowKey, colKey } = target.dataset;
          tableState.value.hoverState = {
            rowIndex: Number(rowIndex),
            rowKey: rowKey ?? "",
            colKey: colKey ?? ""
          }

          handleTooltipEnter(target)
          return;
        }
        target = target.parentElement;
      }
    }

    function handleMouseleave($event: MouseEvent) {
      tableState.value.hoverState = { rowIndex: -1, colKey: "", rowKey: -1 }
      handleTooltipLeave($event)
    }

    const maxXMove = computed(() => viewport.value.get_content_width() - viewport.value.get_width());

    // 通用，需要向下传递的属性
    const commonRowProps = reactive({
      dataSource: dataSource,
      getRowKey: getRowKey,
      transformCellText: tableProps.transformCellText,
      bodyCell: tableSlots.bodyCell,
      customRow: tableProps.customRow,
      rowChildrenName: tableProps.rowChildrenName
    })

    return {
      scroll, scrollState, viewport, maxXMove,

      dataSource,

      bodyRef, bodyInnerRef, bodyClass, bodyStyle,

      bodyLeftRef, leftColumns, leftColumnsVisible, leftStyle, leftGrid,

      bodyRightRef, rightColumns, rightColumnsVisible, rightStyle, rightGrid,

      centerColumns, centerStyle, bodyCenterRef, centerGrid,

      handleMouseenter, handleMouseleave, handleVerticalScrollChange,

      isEmpty: computed(() => {
        return tableState.value.is_empty()
      }),

      commonRowProps,
    }
  }
});
</script>

<style lang="less" scoped>
.s-table-body {
  position: relative;
  transform: translateZ(0);

  &__scrollbar-vertical {
    position: fixed;
    display: inline-block;
    height: 100%;
    width: 4px;
    background-color: red;
    top: 0;
    right: 0;
  }
}

.s-table-body__inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }

  &-fixedLeft {
    z-index: 1;
  }

  &-fixedLeft,
  &-center,
  &-fixedRight {
    display: grid;
  }

  &-center {
    overflow: hidden;
    width: 100%;
    min-width: fit-content;
  }
}
</style>

<style lang="less">
.s-table-body {

  &__scrollbar-hover {
    &:hover>.s-table-scroll__track {
      opacity: 1;
    }

    >.s-table-scroll__track {
      opacity: 0;
      transition: opacity .16s cubic-bezier(0, .5, 1, .5);
    }
  }

  &__empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>