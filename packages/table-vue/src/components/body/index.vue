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

    <Scrollbar v-if="!isEmpty" :state="scrollState" :client="viewport.height" :content="viewport.scroll_height"
      v-model:scroll="scroll.top" :is-vertical="true" />

    <Scrollbar :state="scrollState" :client="viewport.width" :content="viewport.scrollWidth"
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
  onUpdated,
  reactive, ref, shallowRef,
  toRef,
  watch
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
    const gridTemplateRows = computed(() => {
      return tableState.value.getViewportHeightList(dataSource.value).map(height => height + 'px').join(" ");
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
      return tableState.value.viewport.width - leftWidth.value - rightWidth.value;
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
      const style: StyleValue = {}
      const { top: scrollTop } = scroll.value;
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      style.transform = `translateY(${-scrollTop}px)`
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
      tableState.value.updateRowMetas(metas);
    });

    const rightColumns = computed(() => {
      const colStateCenter = tableState.value.colStateCenter;

      return _map2Columns(colStateCenter.lastRightColKeys);
    });

    const rightGrid = computed(() => {
      return genColumnGrid(rightColumns.value, getColWidth, rightWidth.value).map(meta => meta.width)
    });

    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const style: StyleValue = {};
      const { top: scrollTop } = scroll.value;
      style.transform = `translateY(${-scrollTop}px)`;
      style.gridTemplateRows = gridTemplateRows.value;
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
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

    function getViewportDataSource() {
      dataSource.value = tableState.value.getViewportDataSource();
    }

    watch(
      () => [
        tableState.value.scroll.top,
        tableState.value.rowStateCenter.flattenRowKeys,
        tableState.value.pagination?.page,
        tableState.value.pagination?.size,
      ],
      () => {
        getViewportDataSource();
      }
    );

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
      const style: StyleValue = {}
      style.paddingLeft = (bodyLeftBBox.value?.width ?? 0) + 'px'
      style.paddingRight = (bodyRightBBox.value?.width ?? 0) + 'px'
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      style.gridTemplateRows = gridTemplateRows.value;
      const { left: scrollLeft, top: scrollTop } = scroll.value;
      style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`
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

    const maxXMove = computed(() => viewport.value.scrollWidth - viewport.value.width);

    // 通用，需要向下传递的属性
    const commonRowProps = reactive({
      dataSource: dataSource,
      getRowKey: getRowKey,
      transformCellText: tableProps.transformCellText,
      bodyCell: tableSlots.bodyCell,
      customRow: tableProps.customRow,
      childrenRowName: tableProps.childrenRowName
    })

    return {
      scroll, scrollState, viewport, maxXMove,

      dataSource,

      bodyRef, bodyInnerRef, bodyClass, bodyStyle,

      bodyLeftRef, leftColumns, leftColumnsVisible, leftStyle, leftGrid,

      bodyRightRef, rightColumns, rightColumnsVisible, rightStyle, rightGrid,

      centerColumns, centerStyle, bodyCenterRef, centerGrid,

      handleMouseenter, handleMouseleave,

      isEmpty: computed(() => {
        return !tableState.value.isEmpty()
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