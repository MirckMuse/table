<template>
  <div ref="rootRef" :class="rootClass">
    <InteralTable ref="interalTableRef" v-bind="$props">
    </InteralTable>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import InteralTable from "./components/InteralTable.vue";
import { TableProps, TableColumn } from "./typing";
import { useStateProvide } from "./hooks"

// 负责收集用户传递的参数，并将收集到的参数整合传递给 InteralTable 渲染。
defineOptions({
  name: "STable"
});

// 定义插槽
const slots = defineSlots<{
  headerCell?: { title: any; column: TableColumn; },
  // 格式化单元格
  bodyCell?: { title: any; column: TableColumn; text: unknown; index: number }
}>()

const props = defineProps<TableProps>();

const rootRef = ref<HTMLElement>();

useStateProvide({
  props,
  slots,
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