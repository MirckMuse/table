<template>
  <div ref="rootRef" :class="rootClass">
    <InteralTable ref="interalTableRef" v-bind="$props"></InteralTable>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import InteralTable from "./components/InteralTable.vue";
import { useStateProvide } from "./hooks";
import type { TableEmit, TableProps, TableSlot } from "./typing";

// 负责收集用户传递的参数，并将收集到的参数整合传递给 InteralTable 渲染。
defineOptions({
  name: "STable"
});

// 定义插槽
const slots = defineSlots<TableSlot>();

const props = withDefaults(defineProps<TableProps>(), {
  childrenColumnName: "children",
  rowChildrenName: "children"
});

const emit = defineEmits<TableEmit>()

const rootRef = ref<HTMLElement>();

useStateProvide({
  props,
  slots,
  emit,
  tableRef: rootRef
});

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