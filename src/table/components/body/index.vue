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
      <div class="s-table-body__inner-fixedLeft"></div>
      <div 
        class="s-table-body__inner-center" 
        :style="centerStyle"
      >
        <body-cells
          :columns="centerColumns" 
          :data-source="dataSource" 
          :hover-row-index="hoverRowIndex"
        />
      </div>
      <div class="s-table-body__inner-fixedRight">
        <!-- <body-rows :columns="centerColumns" :data-source="dataSource" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StyleValue, defineComponent, ref, computed, onMounted } from "vue";
import { resize } from "../../directives";
import { useStateInject } from "../../hooks"
import BodyCells from "./cells.vue";

export default defineComponent({
  name: "STableBody",

  directives: {
    resize
  },

  components: {
    BodyCells
  },

  setup() {
    const tableState = useStateInject();

    const bodyRef = ref<HTMLElement>();
    const bodyInnerRef = ref<HTMLElement>();
    const bodyClass = computed(() => {
      return [];
    });
    const bodyStyle = computed(() => {
      return {};
    });
    const dataSource = computed(() => {
      return tableState?.dataSource ?? [];
    });

    const centerColumns = computed(() => {
      return tableState?.columns ?? [];
    });

    const centerStyle = computed(() => {
      const style: StyleValue = {}
      style.gridTemplateColumns = centerColumns.value.map(column => column.width ?? '1fr').join(" ");
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

    return {
      dataSource,

      bodyRef, bodyInnerRef, bodyClass, bodyStyle,

      centerColumns, centerStyle,

      hoverRowIndex, handleMouseenter, handleMouseleave,
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

  &-center {
    display: grid;
  }
}
</style>