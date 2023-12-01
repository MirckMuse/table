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
        ref="bodyCenterRef"
        class="s-table-body__inner-center" 
        :style="centerStyle"
      >
        <body-cells
          :columns="centerColumns" 
          :data-source="dataSource" 
          :hover-row-index="hoverRowIndex"
          type="center"
        />
      </div>

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
          :hover-row-index="hoverRowIndex"
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
          :hover-row-index="hoverRowIndex"
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
import { StyleValue, computed, defineComponent, ref, shallowRef } from "vue";
import { resize } from "../../directives";
import { useStateInject, useTableBodyScroll } from "../../hooks";
import Scrollbar from "../scrollbar/index.vue";
import BodyCells from "./cells.vue";

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

    const leftColumns = computed(() => tableState.value.fixedLeftColumns ?? [])
    const leftColumnsVisible = computed(() => leftColumns.value.length);
    const leftStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      style.gridTemplateColumns = leftColumns.value.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });

    const rightColumns = computed(() => tableState.value.fixedRightColumns ?? [])
    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
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

    const dataSource = computed(() => {
      return tableState.value.dataSource ?? [];
    });

    const bodyLeftRef = shallowRef<HTMLElement>();
    const bodyRightRef = shallowRef<HTMLElement>();
    const bodyCenterRef = shallowRef<HTMLElement>();

    useTableBodyScroll(bodyInnerRef, tableState);

    const centerColumns = computed(() => tableState.value.columns ?? []);
    const centerStyle = computed(() => {
      const style: StyleValue = {}
      style.paddingLeft = (bodyLeftRef.value?.clientWidth ?? 0) + 'px'
      style.paddingRight = (bodyRightRef.value?.clientWidth ?? 0) + 'px'
      style.gridTemplateColumns = centerColumns.value.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });


    // 悬浮的行号
    const hoverRowIndex = ref(-1);

    function handleMouseenter($event: MouseEvent) {
      let target: HTMLElement | null = $event.target as HTMLElement;

      while (target) {
        if (target.dataset.type === "cell") {
          hoverRowIndex.value = Number(target.dataset.rowIndex)
          return;
        }
        target = target.parentElement;
      }
      hoverRowIndex.value = -1;
    }

    function handleMouseleave($event: MouseEvent) {
      hoverRowIndex.value = -1;
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

      hoverRowIndex, handleMouseenter, handleMouseleave,
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

  &-fixedLeft,
  &-center,
  &-fixedRight {
    display: grid;
  }

  &-center {
    overflow: hidden;
  }
}
</style>