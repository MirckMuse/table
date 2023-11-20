<template>
  <div
    red="headerRef"
    class="s-table-header"
    :class="headerClass"
    :style="headerStyle"
  >
    <div class="s-table-header__inner">
      <div 
        v-if="leftColumnsVisible" 
        class="s-table-header__inner-fixedLeft" 
        :style="leftStyle"
      >
        <header-cells :columns="leftColumns" />
      </div>

      <div class="s-table-header__inner-center" :style="centerStyle">
        <header-cells :columns="centerColumns" />
      </div>

      <div 
        v-if="rightColumnsVisible" 
        class="s-table-header__inner-fixedRight" 
        :style="rightStyle"
      >
        <header-cells :columns="rightColumns" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, computed, defineComponent, ref } from "vue";
import HeaderCells from "./cells.vue"
import { useStateInject } from "../../hooks";

export default defineComponent({
  name: "STableHeader",

  components: {
    HeaderCells
  },

  setup() {
    const tableState = useStateInject();

    const headerRef = ref<HTMLElement>();
    const headerClass = computed(() => {
      return [];
    });
    const headerStyle = computed(() => {
      return {};
    });

    const leftColumns = computed(() => ([]));
    const leftColumnsVisible = computed(() => leftColumns.value.length);
    const leftStyle = computed<StyleValue>(() => ({}));

    const centerColumns = computed(() => {
      return tableState?.columns ?? [];
    });
    const centerStyle = computed(() => {
      const style: StyleValue = {}
      style.gridTemplateColumns = centerColumns.value.map(column => column.width ?? '1fr').join(" ");
      return style;
    });

    const rightColumns = computed(() => ([]));
    const rightColumnsVisible = computed(() => leftColumns.value.length);
    const rightStyle = computed<StyleValue>(() => ({}));

    return {
      headerRef, headerClass, headerStyle,

      leftColumnsVisible, leftColumns, leftStyle,

      centerColumns, centerStyle,

      rightColumnsVisible, rightColumns, rightStyle
    }
  }
});
</script>

<style lang="less" scoped>

.s-table-header__inner {
  &-center {
    display: grid;
  }
}
</style>