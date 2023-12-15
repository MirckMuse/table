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
      :client="viewport.height" 
      :content="viewport.scrollHeight"
      :scroll="scroll.top"
      :is-vertical="true"
    />

    <Scrollbar 
      :client="viewport.width"
      :content="viewport.scrollWidth"
      :scroll="scroll.left"
    />
  </div>
</template>

<script lang="ts">
import { StyleValue, computed, defineComponent, ref, shallowRef, watch } from "vue";
import { resize } from "../../directives";
import { useBBox, useStateInject, useTableBodyScroll } from "../../hooks";
import Scrollbar from "../scrollbar/index.vue";
import BodyCells from "./cells.vue";
import { RowData } from "../../typing";
import { throttle } from "lodash-es";
import { table } from "console";

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
    const { tableState } = useStateInject();

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
      return [];
    });
    const bodyStyle = computed(() => {
      return {
      };
    });

    watch(
      () => tableState.value.scroll.top,
      () => {
        dataSource.value = tableState.value.getViewportDataSource();
      },
      {
        immediate: true
      }
    )
    const bodyLeftRef = shallowRef<HTMLElement>();
    const bodyRightRef = shallowRef<HTMLElement>();
    const bodyCenterRef = shallowRef<HTMLElement>();

    const { bbox: bodyLeftBBox } = useBBox(bodyLeftRef);
    const { bbox: bodyRightBBox } = useBBox(bodyRightRef);

    useTableBodyScroll(bodyInnerRef, tableState);

    const centerColumns = computed(() => tableState.value.dfsCenterFlattenColumns);
    const centerStyle = computed(() => {
      const style: StyleValue = {}
      style.paddingLeft = (bodyLeftBBox.value?.width ?? 0) + 'px'
      style.paddingRight = (bodyRightBBox.value?.width ?? 0) + 'px'
      style.paddingTop = (tableState.value.rowOffset.top ?? 0) + 'px'
      style.gridTemplateRows = gridTemplateRows.value;
      style.paddingBottom = (tableState.value.rowOffset.bottom ?? 0) + 'px'
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
          return;
        }
        target = target.parentElement;
      }
    }

    function handleMouseleave($event: MouseEvent) {
      tableState.value.hoverState = { rowIndex: -1, colKey: "" }
    }

    const maxXMove = computed(() => {
      return viewport.value.scrollWidth - viewport.value.width;
    })

    return {
      scroll, viewport, maxXMove,

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
    width: max-content;
  }
}
</style>