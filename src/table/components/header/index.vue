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
        <header-cells :columns="leftColumns" :flatten-columns="leftFlattenColumns" />
      </div>

      <div
        ref="headerCenterRef"
        class="s-table-header__inner-center"
        :style="centerStyle"
      >
        <header-cells :columns="centerColumns" :flatten-columns="centerFlattenColumns" type="center" />
      </div>

      <div 
        v-if="rightColumnsVisible" 
        class="s-table-header__inner-fixedRight s-table-fixedRight" 
        :class="{ 'shadow': scroll.left < maxXMove }"
        :style="rightStyle"
        ref="headerRightRef"
      >
        <header-cells :columns="rightColumns" :flatten-columns="rightFlattenColumns" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, computed, defineComponent, shallowRef } from "vue";
import { useStateInject, useTableHeaderScroll } from "../../hooks";
import HeaderCells from "./cells.vue";

export default defineComponent({
  name: "STableHeader",

  components: {
    HeaderCells
  },

  setup() {
    const {
      tableState
    } = useStateInject();

    const headerCenterRef = shallowRef<HTMLElement>();

    const headerRef = shallowRef<HTMLElement>();
    const headerLeftRef = shallowRef<HTMLElement>();
    const headerRightRef = shallowRef<HTMLElement>();

    useTableHeaderScroll(
      headerRef,
      headerCenterRef,
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
      const lastColumns = tableState.value.dfsFixedLeftFlattenColumns;
      const maxDeep = tableState.value.maxTableHeaderDeep;
      style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
      style.gridTemplateColumns = lastColumns.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });
    const centerColumns = computed(() => tableState.value.columns ?? []);

    const centerFlattenColumns = computed(() => tableState.value.centerFlattenColumns ?? []);

    const centerStyle = computed(() => {
      const style: StyleValue = {};
      style.paddingLeft = (headerLeftRef.value?.clientWidth ?? 0) + "px";
      style.paddingRight = (headerRightRef.value?.clientWidth ?? 0) + "px";
      const lastColumns = tableState.value.dfsCenterFlattenColumns;
      const maxDeep = tableState.value.maxTableHeaderDeep;
      style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
      style.gridTemplateColumns = lastColumns.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });


    const rightColumns = computed(() => tableState.value.fixedRightColumns ?? []);
    const rightFlattenColumns = computed(() => tableState.value.fixedRightFlattenColumns ?? []);
    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => {
      const style: StyleValue = {}
      const lastColumns = tableState.value.dfsFixedRightFlattenColumns;
      const maxDeep = tableState.value.maxTableHeaderDeep;
      style.gridTemplateRows = "repeat(" + maxDeep + ", 52px)";
      style.gridTemplateColumns = lastColumns.map(column => {
        let width = column.width;
        if (typeof width === "number") {
          width = `${width}px`;
        }
        return width ?? 'minmax(120px, 1fr)'
      }).join(" ");
      return style;
    });

    const scroll = computed(() => tableState.value.scroll);

    const maxXMove = computed(() => tableState.value.viewport.scrollWidth - tableState.value.viewport.width);

    return {
      scroll, maxXMove,

      headerRef, headerClass, headerStyle,

      headerLeftRef, leftColumnsVisible, leftColumns, leftFlattenColumns, leftStyle,

      headerCenterRef, centerColumns, centerFlattenColumns, centerStyle,

      headerRightRef, rightColumnsVisible, rightColumns, rightFlattenColumns, rightStyle
    }
  }
});
</script>

<style lang="less" scoped>

.s-table-header__inner {
  position: relative;
  overflow: hidden;

  &-fixedLeft,
  &-center,
  &-fixedRight {
    display: grid;
  }

  &-fixedLeft{
    z-index: 1;
  }

  &-center {
    width: max-content;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>