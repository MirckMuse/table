<template>
  <div
    ref="headerRef"
    class="s-table-header"
    :class="headerClass"
    :style="headerStyle"
  >
    <div class="s-table-header__inner">
      <div 
        v-if="leftColumnsVisible" 
        class="s-table-header__inner-fixedLeft s-table-fixedLeft" 
        :class="{ 'shadow': scroll.left > 0 }"
        :style="leftStyle"
        ref="headerLeftRef"
      >
        <header-cells :columns="leftColumns" :flatten-columns="leftFlattenColumns" >
        </header-cells>
      </div>

      <div
        ref="headerCenterRef"
        class="s-table-header__inner-center"
        :style="centerStyle"
      >
        <header-cells :columns="centerColumns" :flatten-columns="centerFlattenColumns" type="center">
        </header-cells>
      </div>

      <div 
        v-if="rightColumnsVisible" 
        class="s-table-header__inner-fixedRight s-table-fixedRight" 
        :class="{ 'shadow': scroll.left < maxXMove }"
        :style="rightStyle"
        ref="headerRightRef"
      >
        <header-cells :columns="rightColumns" :flatten-columns="rightFlattenColumns" >
        </header-cells>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { throttle } from "lodash-es";
import { StyleValue, computed, onMounted, shallowRef, watch } from "vue";
import { useStateInject, useTableHeaderScroll } from "../../hooks";
import { genGridTemplateColumns, runIdleTask } from "../../utils";
import HeaderCells from "./cells.vue";
import { nextTick } from "process";

defineOptions({
  name: "STableHeader",
});

const { tableState } = useStateInject();

const headerCenterRef = shallowRef<HTMLElement>();

const headerRef = shallowRef<HTMLElement>();
const headerLeftRef = shallowRef<HTMLElement>();
const headerRightRef = shallowRef<HTMLElement>();
const updateViewportWidth = throttle(function () {
  const viewport = {
    width: headerRef.value?.offsetWidth ?? 0,
    scrollWidth: headerCenterRef.value?.scrollWidth ?? 0
  }


  runIdleTask(() => {
    Object.assign(tableState.value.viewport, viewport)
    tableState.value.updateScroll();
  })
}, 16)

onMounted(() => {
  nextTick(() => {
    updateViewportWidth()
  })
})

const { headerLeftBBox, headerRightBBox } = useTableHeaderScroll(
  headerRef,
  headerLeftRef,
  headerCenterRef,
  headerRightRef,
  tableState
);

const headerClass = computed(() => {
  return [];
});
const headerStyle = computed(() => {
  return {};
});

const leftColumns = computed(() => tableState.value.fixedLeftColumns ?? []);
const leftFlattenColumns = computed(() => tableState.value.fixedLeftFlattenColumns)
const leftColumnsVisible = computed(() => leftColumns.value.length);
const leftStyle = computed<StyleValue>(() => {
  const style: StyleValue = {}
  const maxDeep = tableState.value.maxTableHeaderDeep;
  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(tableState.value.dfsFixedLeftFlattenColumns);
  return style;
});
const centerColumns = computed(() => tableState.value.columns ?? []);

const scroll = computed(() => tableState.value.scroll);

const centerFlattenColumns = computed(() => tableState.value.centerFlattenColumns ?? []);

const centerStyle = computed(() => {
  const style: StyleValue = {};
  const { left: scrollLeft } = scroll.value;
  style.paddingLeft = `${headerLeftBBox.value.width}px`;
  style.paddingRight = `${headerRightBBox.value.width}px`;
  style.transform = `translateX(${-scrollLeft}px)`
  const maxDeep = tableState.value.maxTableHeaderDeep;
  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(tableState.value.dfsCenterFlattenColumns);
  return style;
});


const rightColumns = computed(() => tableState.value.fixedRightColumns ?? []);
const rightFlattenColumns = computed(() => tableState.value.fixedRightFlattenColumns ?? []);
const rightColumnsVisible = computed(() => leftColumns.value.length);
const rightStyle = computed<StyleValue>(() => {
  const style: StyleValue = {}
  const maxDeep = tableState.value.maxTableHeaderDeep;
  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(tableState.value.dfsFixedRightFlattenColumns);
  return style;
});

const maxXMove = computed(() => {
  return tableState.value.viewport.scrollWidth - tableState.value.viewport.width
});


// TODO: 最好是监听 colmetas 来触发 viewport 的改变
watch(
  () => tableState.value.columns,
  updateViewportWidth,
  { deep: true }
)
</script>

<style lang="less" scoped>

.s-table-header__inner {
  position: relative;
  overflow: auto;
  &::-webkit-scrollbar {
      display: none;
  }

  &-fixedLeft,
  &-center,
  &-fixedRight {
    display: grid;
  }

  &-fixedLeft{
    z-index: 1;
  }

  &-center {
    overflow: auto;
    width: 100%;
    min-width: fit-content;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>