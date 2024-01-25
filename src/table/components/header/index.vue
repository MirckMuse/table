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
import { ColKey, TableColumn } from "@stable/table-typing";

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

const leftColumns = computed(() => {
  const colStateCenter = tableState.value.colStateCenter;

  return _map2Columns(colStateCenter.lastLeftColKeys ?? []);
});
const leftFlattenColumns = computed(() => {
  const colStateCenter = tableState.value.colStateCenter;

  return _map2Columns(colStateCenter.leftColKeys ?? []);
});

const leftColumnsVisible = computed(() => leftColumns.value.length);
const leftStyle = computed<StyleValue>(() => {
  const colStateCenter = tableState.value.colStateCenter;
  const style: StyleValue = {}
  const maxDeep = colStateCenter.maxTableHeaderDeep + 1;
  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(_map2Columns(colStateCenter.lastLeftColKeys ?? []));
  return style;
});
const centerColumns = computed(() => {
  const colStateCenter = tableState.value.colStateCenter;

  return _map2Columns(colStateCenter.lastCenterColKeys ?? [])
});

const scroll = computed(() => tableState.value.scroll);

const centerFlattenColumns = computed(() => {
  const colStateCenter = tableState.value.colStateCenter;

  return _map2Columns(colStateCenter.centerColKeys ?? [])
});

const centerStyle = computed(() => {
  const colStateCenter = tableState.value.colStateCenter;

  const style: StyleValue = {};
  const { left: scrollLeft } = scroll.value;
  style.paddingLeft = `${headerLeftBBox.value.width}px`;
  style.paddingRight = `${headerRightBBox.value.width}px`;
  style.transform = `translateX(${-scrollLeft}px)`
  const maxDeep = colStateCenter.maxTableHeaderDeep + 1;
  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(_map2Columns(colStateCenter.lastCenterColKeys ?? []));
  return style;
});


const rightColumns = computed(() => {
  const colStateCenter = tableState.value.colStateCenter;

  return _map2Columns(colStateCenter.lastRightColKeys ?? [])
});
const rightFlattenColumns = computed(() => {
  const colStateCenter = tableState.value.colStateCenter;
  return _map2Columns(colStateCenter.rightColKeys ?? [])
});
const rightColumnsVisible = computed(() => leftColumns.value.length);
const rightStyle = computed<StyleValue>(() => {
  const colStateCenter = tableState.value.colStateCenter;
  const style: StyleValue = {}
  const maxDeep = colStateCenter.maxTableHeaderDeep + 1;

  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(_map2Columns(colStateCenter.lastRightColKeys ?? []));
  return style;
});

const maxXMove = computed(() => {
  return tableState.value.viewport.scrollWidth - tableState.value.viewport.width
});

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