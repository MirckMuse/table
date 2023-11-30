<template>
  <component :is="InteralSpin" v-bind="spinProps">
    <component v-if="paginationProps.vertical === 'top'" :is="InteralPagination" v-bind="paginationBind"></component>

    <div ref="tableRef" :class="tableClass" :style="tableStyle">
      <TableHeader ref="tableHeaderRef"></TableHeader>
      <TableBody ref="tableBodyRef" style="flex: 1; min-height: 0;"></TableBody>
    </div>

    <component v-if="paginationProps.vertical === 'bottom'" :is="InteralPagination" v-bind="paginationBind"></component>
  </component>
</template>

<script lang="ts" setup>
import { Pagination as APagination, Spin as ASpin } from "ant-design-vue";

import { StyleValue, computed, ref } from "vue";
import { useOverrideInject } from "../context/OverrideContext";
import { usePagination } from "../hooks";
import { TableProps } from "../typing";
import TableBody from "./body/index.vue";
import TableHeader from "./header/index.vue";
import { useHorizontalScrollProvide, useSelectionProvide } from "../hooks"

useSelectionProvide();

defineOptions({
  name: "SInteralTable",
});

useHorizontalScrollProvide();

const props = defineProps<TableProps>()

const {
  spin: overrideSpin,
  pagination: overridePagination,
} = useOverrideInject();

const prefixClass = "s-table";

// table 相关的属性
const tableRef = ref<HTMLElement>();
const tableClass = computed(() => {
  return {
    [`${prefixClass}-interal`]: true,
    [`${prefixClass}-bordered`]: props.bordered
  };
});
const tableStyle = computed<StyleValue>(() => {
  const { y } = props.scroll || {};

  return {
    height: typeof y ? `${y}px` : y,
  };
});

const tableHeaderRef = ref<any>();
const tableBodyRef = ref<any>();

// Spin 组件相关
const InteralSpin = overrideSpin?.component ?? ASpin;
const spinProps = computed(() => {
  return Object.assign({}, overrideSpin?.props, { spinning: !!props.loading });
});

// Pagination 组件相关
const InteralPagination = overridePagination?.component ?? APagination;
const {
  props: paginationProps,
  onChange: onPaginationChange,
} = usePagination(props);


const paginationBind = computed(() => {
  return {
    class: `s-pagination s-pagination-${paginationProps.value.horizontal || 'right'}`,
    onChange: onPaginationChange,
    onShowSizeChange: onPaginationChange,
  }
});
</script>

<style lang="less" scoped>
.s-table-interal {
  display: flex;
  flex-direction: column;
}
</style>