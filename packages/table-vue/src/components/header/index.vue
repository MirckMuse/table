<template>
  <div ref="headerRef" class="s-table-header" :class="headerClass" :style="headerStyle">
    <div class="s-table-header__inner">
      <div v-if="leftColumnsVisible" class="s-table-header__inner-fixedLeft s-table-fixedLeft"
        :class="{ 'shadow': scroll.left > 0 }" :style="leftStyle" ref="headerLeftRef">
        <header-cells :columns="leftColumns" :flatten-columns="leftFlattenColumns">
        </header-cells>
      </div>

      <div ref="headerCenterRef" class="s-table-header__inner-center" :style="centerStyle">
        <header-cells :columns="centerColumns" :flatten-columns="centerFlattenColumns" type="center">
        </header-cells>
      </div>

      <div v-if="rightColumnsVisible" class="s-table-header__inner-fixedRight s-table-fixedRight"
        :class="{ 'shadow': scroll.left < maxXMove }" :style="rightStyle" ref="headerRightRef">
        <header-cells :columns="rightColumns" :flatten-columns="rightFlattenColumns">
        </header-cells>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ColKey, TableColumn } from "@scode/table-typing";
import { throttle } from "lodash-es";
import type { StyleValue } from "vue";
import { computed, onMounted, onUnmounted, shallowRef } from "vue";
import { useStateInject, useTableHeaderScroll } from "../../hooks";
import { genGridTemplateColumns } from "../../utils";
import HeaderCells from "./cells.vue";

defineOptions({
  name: "STableHeader",
});

const { tableState } = useStateInject();

const headerCenterRef = shallowRef<HTMLElement>();

const headerRef = shallowRef<HTMLElement>();
const headerLeftRef = shallowRef<HTMLElement>();
const headerRightRef = shallowRef<HTMLElement>();

const updateViewportWidth = throttle(() => tableState.value.adjust_scroll(), 16);

const resize = new ResizeObserver(updateViewportWidth);

onMounted(() => {
  headerLeftRef.value && resize.observe(headerLeftRef.value);
  headerCenterRef.value && resize.observe(headerCenterRef.value);
  headerRightRef.value && resize.observe(headerRightRef.value);
  updateViewportWidth()
});

onUnmounted(() => {
  headerLeftRef.value && resize.unobserve(headerLeftRef.value);
  headerCenterRef.value && resize.unobserve(headerCenterRef.value);
  headerRightRef.value && resize.unobserve(headerRightRef.value);
  resize.disconnect();
});

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

function getColWidth(column: TableColumn) {
  return tableState.value.col_state.get_col_width_by_column(column)
}

function _map2Columns(colKeys: ColKey[]) {
  const colStateCenter = tableState.value.col_state;

  return colKeys.reduce<TableColumn[]>((columns, colKey) => {
    const column = colStateCenter.get_column_by_col_key(colKey);
    if (column) {
      columns.push(column);
    }
    return columns;
  }, [])
}

const leftColumns = computed(() => _map2Columns(tableState.value.last_left_col_keys ?? []));
const leftFlattenColumns = computed(() => _map2Columns(tableState.value.left_col_keys ?? []));

const leftWidth = computed(() => {
  const col_state = tableState.value.col_state;

  return tableState.value.last_left_col_keys.reduce((width, colKey) => width + col_state.get_col_width_by_col_key(colKey), 0)
});

const rightWidth = computed(() => {
  const col_state = tableState.value.col_state;

  return tableState.value.last_right_col_keys.reduce((width, colKey) => width + col_state.get_col_width_by_col_key(colKey), 0)
});

const centerWidth = computed(() => {
  return tableState.value.viewport.get_width() - leftWidth.value - rightWidth.value;
});

const leftColumnsVisible = computed(() => leftColumns.value.length);
const leftStyle = computed<StyleValue>(() => {
  const style: StyleValue = {}
  const maxDeep = tableState.value.col_state.get_max_deep() + 1;
  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(
    _map2Columns(tableState.value.last_left_col_keys ?? []),
    getColWidth,
    leftWidth.value
  );
  return style;
});

const centerColumns = computed(() => _map2Columns(tableState.value.last_center_col_keys ?? []));

const scroll = computed(() => tableState.value.scroll);

const centerFlattenColumns = computed(() => _map2Columns(tableState.value.center_col_keys ?? []));

const centerStyle = computed(() => {
  const col_state = tableState.value.col_state;

  const style: StyleValue = {};
  const { left: scrollLeft } = scroll.value;
  style.paddingLeft = `${headerLeftBBox.value.width}px`;
  style.paddingRight = `${headerRightBBox.value.width}px`;
  style.transform = `translateX(${-scrollLeft}px)`
  const maxDeep = col_state.get_max_deep() + 1;
  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(
    _map2Columns(tableState.value.last_center_col_keys ?? []),
    getColWidth,
    centerWidth.value
  );
  return style;
});


const rightColumns = computed(() => _map2Columns(tableState.value.last_right_col_keys ?? []));
const rightFlattenColumns = computed(() => _map2Columns(tableState.value.right_col_keys ?? []));

const rightColumnsVisible = computed(() => leftColumns.value.length);
const rightStyle = computed<StyleValue>(() => {
  const style: StyleValue = {}
  const maxDeep = tableState.value.col_state.get_max_deep() + 1;

  style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
  style.gridTemplateColumns = genGridTemplateColumns(
    _map2Columns(tableState.value.last_right_col_keys ?? []),
    getColWidth,
    rightWidth.value
  );
  return style;
});

const maxXMove = computed(() => {
  const viewport = tableState.value.viewport;
  return viewport.get_content_width() - viewport.get_width();
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

  &-fixedLeft {
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