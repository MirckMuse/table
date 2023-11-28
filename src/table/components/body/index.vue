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
        />
      </div>

      <div
        v-if="leftColumnsVisible"
        ref="bodyLeftRef"
        class="s-table-body__inner-fixedLeft"
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
        class="s-table-body__inner-fixedRight"
        :style="rightStyle"
      >
        <body-cells 
          :columns="rightColumns" 
          :data-source="dataSource" 
          :hover-row-index="hoverRowIndex"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, computed, defineComponent, ref, shallowRef } from "vue";
import { resize } from "../../directives";
import { useStateInject } from "../../hooks";
import BodyCells from "./cells.vue";
import HorizontalScrollbar from "../scrollbar/horizontal.vue"
import { useScrollInject } from "../../hooks";

export default defineComponent({
  name: "STableBody",

  directives: {
    resize
  },

  components: {
    BodyCells,
    HorizontalScrollbar
  },

  setup() {
    const tableState = useStateInject();

    const leftColumns = computed(() => tableState?.fixedLeftColumns ?? [])
    const leftColumnsVisible = computed(() => leftColumns.value.length);
    const leftStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      style.gridTemplateColumns = leftColumns.value.map(column => column.width ?? 'minmax(120px, 1fr)').join(" ");
      return style;
    });

    const rightColumns = computed(() => tableState?.fixedRightColumns ?? [])
    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      style.gridTemplateColumns = leftColumns.value.map(column => column.width ?? 'minmax(120px, 1fr)').join(" ");
      return style;
    });


    const bodyRef = ref<HTMLElement>();
    const bodyInnerRef = shallowRef<HTMLElement>();
    const bodyClass = computed(() => {
      return [];
    });
    const bodyStyle = computed(() => {
      return {};
    });

    const dataSource = computed(() => {
      return tableState?.dataSource ?? [];
    });

    const bodyLeftRef = shallowRef<HTMLElement>();
    const bodyRightRef = shallowRef<HTMLElement>();
    const bodyCenterRef = shallowRef<HTMLElement>();

    useScrollInject(bodyCenterRef);

    const centerColumns = computed(() => tableState?.columns ?? []);
    const centerStyle = computed(() => {
      const style: StyleValue = {}
      style.paddingLeft = (bodyLeftRef.value?.clientWidth ?? 0) + 'px'
      style.paddingRight = (bodyRightRef.value?.clientWidth ?? 0) + 'px'
      style.gridTemplateColumns = centerColumns.value.map(column => column.width ?? 'minmax(120px, 1fr)').join(" ");
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

    const horizontalScrollbarVisible = computed(() => {
      if (!bodyCenterRef.value || !bodyInnerRef.value) return false;

      return bodyCenterRef.value.scrollWidth < bodyInnerRef.value.clientWidth;
    });

    function handleScroll(...args: any) {
      console.log(args)
      console.log('handleScroll')
    }

    return {
      dataSource,

      bodyRef, bodyInnerRef, bodyClass, bodyStyle,

      bodyLeftRef, leftColumns, leftColumnsVisible, leftStyle,

      bodyRightRef, rightColumns, rightColumnsVisible, rightStyle,

      centerColumns, centerStyle, bodyCenterRef,

      hoverRowIndex, handleMouseenter, handleMouseleave,

      horizontalScrollbarVisible, handleScroll
    }
  }
});
</script>

<style lang="less" scoped>

.s-table-body__inner {
  width: 100%;
  overflow: hidden;
  
  position: relative;
  transform: translateZ(0);

  &-fixedLeft {
    display: grid;
    position: absolute;
    left: 0;
    top: 0;
  }
  
  &-fixedRight {
    display: grid;
    position: absolute;
    right: 0;
    top: 0;
  }

  &-center {
    display: grid;
    overflow-x: auto;
  }
}
</style>