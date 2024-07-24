<template>
  <div ref="rootRef" :class="rootClass">
    <InteralTable ref="interalTableRef" v-bind="$props"></InteralTable>
  </div>
</template>

<script lang="ts" setup>
import { computed, shallowRef } from "vue";
import InteralTable from "./components/InteralTable.vue";
import { useProvideTableCallback, useStateProvide } from "./hooks";
import type { TableEmit, TableProps, TableSlot } from "./typing";

// 负责收集用户传递的参数，并将收集到的参数整合传递给 InteralTable 渲染。
defineOptions({
  name: "STable"
});

// 定义插槽
const slots = defineSlots<TableSlot>();

const props = withDefaults(defineProps<TableProps>(), {
  childrenColumnName: "children",
  rowChildrenName: "children",
  pagination: true,
  prefixCls: "s-table"
});

const emit = defineEmits<TableEmit>()

const rootRef = shallowRef<HTMLElement>();

const interalTableRef = shallowRef<HTMLElement>();

const { table_state } = useStateProvide({
  props,
  slots,
  emit,
  tableRef: rootRef
});

useProvideTableCallback({
  table_state: table_state,
  table_emit: emit,
  processPaginationChange: props.processPaginationChange,
  processFilterChange: props.processFilterChange,
  processSortChange: props.processSortChange,
});

const rootClass = computed(() => {
  return [
    props.prefixCls
  ];
});
</script>

<style lang="less" scoped>
.s-table {
  overscroll-behavior: contain;
}
</style>
