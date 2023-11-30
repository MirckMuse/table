<template>
  <div
    red="headerRef"
    class="s-table-header"
    :class="headerClass"
    :style="headerStyle"
  >
    <div class="s-table-header__inner">
      <div
        ref="headerCenterRef"
        class="s-table-header__inner-center"
        :style="centerStyle"
      >
        <header-cells :columns="centerColumns" />
      </div>

      <div 
        v-if="leftColumnsVisible" 
        class="s-table-header__inner-fixedLeft s-table-fixedLeft" 
        :class="{ 'shadow': scrollLeft > 0 }"
        :style="leftStyle"
        ref="headerLeftRef"
      >
        <header-cells :columns="leftColumns" />
      </div>
      <div 
        v-if="rightColumnsVisible" 
        class="s-table-header__inner-fixedRight s-table-fixedRight" 
        :class="{ 'shadow': scrollLeft < scrollRange }"
        :style="rightStyle"
        ref="headerRightRef"
      >
        <header-cells :columns="rightColumns" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, computed, defineComponent, ref, shallowReactive, shallowRef, triggerRef, watch } from "vue";
import HeaderCells from "./cells.vue"
import { useHorizontalScrollInject, useStateInject } from "../../hooks";

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

    const { scrollLeft, scrollRange } = useHorizontalScrollInject(headerCenterRef);

    const headerClass = computed(() => {
      return [];
    });
    const headerStyle = computed(() => {
      return {};
    });

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

    const centerColumns = computed(() => tableState.value.columns ?? []);
    const centerStyle = computed(() => {
      const style: StyleValue = {};
      style.paddingLeft = (headerLeftRef.value?.clientWidth ?? 0) + "px";
      style.paddingRight = (headerRightRef.value?.clientWidth ?? 0) + "px";

      style.gridTemplateColumns = centerColumns.value.map(column => {
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

    return {
      scrollLeft, scrollRange,

      headerRef, headerClass, headerStyle,

      headerLeftRef, leftColumnsVisible, leftColumns, leftStyle,

      headerCenterRef, centerColumns, centerStyle,

      headerRightRef, rightColumnsVisible, rightColumns, rightStyle
    }
  }
});
</script>

<style lang="less" scoped>

.s-table-header__inner {
  position: relative;

  &-fixedLeft,
  &-center,
  &-fixedRight {
    display: grid;
  }
  &-center {
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>