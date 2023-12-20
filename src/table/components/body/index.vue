<template>
  <div
    v-resize:height
    ref="bodyRef"
    class="s-table-body"
    :class="bodyClass"
    :style="bodyStyle"
  >
    <div 
      class="s-table-body__inner"
      ref="bodyInnerRef"
      @mouseover="handleMouseenter"
      @mouseout="handleMouseleave"
    >
      <div
        v-if="leftColumnsVisible"
        ref="bodyLeftRef"
        class="s-table-body__inner-fixedLeft s-table-fixedLeft"
        :class="{ 'shadow': scroll.left > 0 }"
        :style="leftStyle"
      >
        <body-cells
          :columns="leftColumns" 
          :data-source="dataSource" 
        />
      </div>

      <div 
        ref="bodyCenterRef"
        class="s-table-body__inner-center" 
        :style="centerStyle"
      >
        <body-cells
          :columns="centerColumns" 
          :data-source="dataSource" 
          type="center"
        />
      </div>

      <div
        v-if="rightColumnsVisible"
        ref="bodyRightRef"
        class="s-table-body__inner-fixedRight s-table-fixedRight"
        :class="{ 'shadow': scroll.left < maxXMove }"
        :style="rightStyle"
      >
        <body-cells 
          :columns="rightColumns" 
          :data-source="dataSource" 
        />
      </div>
    </div>
    
    <Scrollbar
      :state="scrollState"
      :client="viewport.height" 
      :content="viewport.scrollHeight"
      :scroll="scroll.top"
      :is-vertical="true"
    />

    <Scrollbar 
      :state="scrollState"
      :client="viewport.width"
      :content="viewport.scrollWidth"
      :scroll="scroll.left"
    />
  </div>
</template>

<script lang="ts">
import { StyleValue, computed, defineComponent, onMounted, onUpdated, ref, shallowRef, watch } from "vue";
import { CellMeta } from "../../../state";
import { resize } from "../../directives";
import { useBBox, useStateInject, useTableBodyScroll } from "../../hooks";
import { RowData } from "../../typing";
import { px2Number, runIdleTask } from "../../utils";
import Scrollbar from "../scrollbar/index.vue";
import BodyCells from "./cells.vue";
import { nextTick } from "process";
import { table } from "console";
import { throttle } from "lodash-es";

export default defineComponent({
  name: "STableBody",

  directives: {
    resize
  },

  components: {
    BodyCells,
    Scrollbar,
  },

  setup() {
    const {
      tableState,
      tableProps,
      handleTooltipEnter,
      handleTooltipLeave
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

    const leftColumns = computed(() => tableState.value.dfsFixedLeftFlattenColumns)
    const leftColumnsVisible = computed(() => leftColumns.value.length);
    const leftStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      const { top: scrollTop } = scroll.value;
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      style.transform = `translateY(${-scrollTop}px)`
      style.gridTemplateRows = gridTemplateRows.value;
      style.gridTemplateColumns = leftColumns.value.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
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
      const metas: CellMeta[] = [];
      for (const element of innserElements) {
        const cellElement = element.parentElement as HTMLElement;
        const { top, bottom } = getCellPadding(cellElement)
        const { colKey, rowIndex } = cellElement.dataset
        metas.push({
          // 以行的索引作为 key 值。
          colKey: colKey ?? "",
          rowIndex: rowIndex ? Number(rowIndex) : -1,
          height: Math.floor(element.getBoundingClientRect().height) + top + bottom
        })
      }
      runIdleTask(() => {
        tableState.value.updateCellMetas(metas);
      })
    });

    const rightColumns = computed(() => tableState.value.dfsFixedRightFlattenColumns);
    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const style: StyleValue = {};
      const { top: scrollTop } = scroll.value;
      style.transform = `translateY(${-scrollTop}px)`;
      style.gridTemplateRows = gridTemplateRows.value;
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      style.gridTemplateColumns = rightColumns.value.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });


    const bodyRef = ref<HTMLElement>();
    const bodyInnerRef = shallowRef<HTMLElement>();

    const viewport = computed(() => tableState.value.viewport)
    const scroll = computed(() => tableState.value.scroll)
    const bodyClass = computed(() => {
      const clas: string[] = [];
      if (scrollState.value.mode === "hover") {
        clas.push("s-table-body__scrollbar-hover")
      }
      return clas;
    });
    const bodyStyle = computed(() => {
      return {
      };
    });

    watch(
      () => [
        tableState.value.scroll.top,
        tableState.value.dataSourceLength
      ],
      () => {
        dataSource.value = tableState.value.getViewportDataSource()
      }
    );

    nextTick(() => {
      dataSource.value = tableState.value.getViewportDataSource()
    })

    const bodyLeftRef = shallowRef<HTMLElement>();
    const bodyRightRef = shallowRef<HTMLElement>();
    const bodyCenterRef = shallowRef<HTMLElement>();

    const updateViewportWidth = throttle(function () {
      tableState.value.viewport.width = bodyInnerRef.value?.offsetWidth ?? 0;
      tableState.value.viewport.scrollWidth = bodyCenterRef.value?.scrollWidth ?? 0;
      tableState.value.updateScroll();
    }, 16)

    onUpdated(updateViewportWidth)

    const { bbox: bodyLeftBBox } = useBBox(bodyLeftRef);
    const { bbox: bodyRightBBox } = useBBox(bodyRightRef);

    useTableBodyScroll(bodyInnerRef, tableState);

    const centerColumns = computed(() => tableState.value.dfsCenterFlattenColumns);
    const centerStyle = computed(() => {
      const style: StyleValue = {}
      style.paddingLeft = (bodyLeftBBox.value?.width ?? 0) + 'px'
      style.paddingRight = (bodyRightBBox.value?.width ?? 0) + 'px'
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
      style.gridTemplateRows = gridTemplateRows.value;
      const { left: scrollLeft, top: scrollTop } = scroll.value;
      style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`
      style.gridTemplateColumns = centerColumns.value.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });

    function handleMouseenter($event: MouseEvent) {
      let target: HTMLElement | null = $event.target as HTMLElement;

      while (target) {
        if (target.dataset.type === "cell") {
          tableState.value.hoverState = {
            rowIndex: Number(target.dataset.rowIndex),
            colKey: target.dataset.colKey ?? ""
          }

          handleTooltipEnter(target)
          return;
        }
        target = target.parentElement;
      }
    }

    function handleMouseleave($event: MouseEvent) {
      tableState.value.hoverState = { rowIndex: -1, colKey: "" }
      handleTooltipLeave($event)
    }

    const maxXMove = computed(() => {
      return viewport.value.scrollWidth - viewport.value.width;
    })

    return {
      scroll, scrollState, viewport, maxXMove,

      dataSource,

      bodyRef, bodyInnerRef, bodyClass, bodyStyle,

      bodyLeftRef, leftColumns, leftColumnsVisible, leftStyle,

      bodyRightRef, rightColumns, rightColumnsVisible, rightStyle,

      centerColumns, centerStyle, bodyCenterRef,

      handleMouseenter, handleMouseleave,
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
    width: fit-content;
  }
}
</style>

<style lang="less">
.s-table-body {

  &__scrollbar-hover {
    &:hover > .s-table-scroll__track {
      opacity: 1;
    }
    > .s-table-scroll__track {
      opacity: 0;
      transition: opacity .16s cubic-bezier(0, .5, 1, .5);
    }
  }
}</style>