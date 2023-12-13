<template>
  <div ref="rootRef" :class="rootClass">
    <InteralTable ref="interalTableRef" v-bind="$props">
      <template v-if="$slots.expandIcon" #expandIcon>
        <slot name="expandIcon"></slot>
      </template>
    </InteralTable>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import InteralTable from "./components/InteralTable.vue";
import { TableProps } from "./typing";
import { useStateProvide } from "./hooks"

// 负责收集用户传递的参数，并将收集到的参数整合传递给 InteralTable 渲染。
defineOptions({
  name: "STable"
});

const props = defineProps<TableProps>();

const rootRef = ref<HTMLElement>();
useStateProvide(props, rootRef);

const interalTableRef = ref<HTMLElement>();

const rootClass = computed(() => {
  return [
    "s-table"
  ];
})
</script>

<style lang="less" scoped>
.s-table {
  overscroll-behavior: contain;
}
</style>