<template>
  <component :is="InteralSpin" v-bind="spinProps">
    <!-- 分页组件[顶部] -->
    <component
      v-if="paginationVisible && paginationProps.vertical === 'top'"
      :is="InteralPagination"
      v-bind="paginationBind"
    ></component>

    <div ref="tableRef" :class="tableClass" :style="tableStyle">
      <TableHeader ref="tableHeaderRef"></TableHeader>
      <TableBody ref="tableBodyRef" style="flex: 1; min-height: 0"></TableBody>
    </div>

    <!-- 分页组件[底部] -->
    <component
      v-if="paginationVisible && paginationProps.vertical === 'bottom'"
      :is="InteralPagination"
      v-bind="paginationBind"
    ></component>
  </component>
</template>

<script lang="ts" setup>
import type { TableProps } from "../typing";
import type { StyleValue } from "vue";

import { Pagination as APagination, Spin as ASpin } from "ant-design-vue";
import { computed, ref, watch } from "vue";
import { useOverrideInject } from "../context/OverrideContext";
import { usePagination, useSelectionProvide, useStateInject } from "../hooks";
import TableBody from "./body/index.vue";
import TableHeader from "./header/index.vue";

useSelectionProvide();

defineOptions({
  name: "SInteralTable",
});

const slots = defineSlots();

const props = defineProps<TableProps>();

const { spin: overrideSpin, pagination: overridePagination } =
  useOverrideInject();

const { tableState } = useStateInject();

const prefixClass = "s-table";

// table 相关的属性
const tableRef = ref<HTMLElement>();
const tableClass = computed(() => {
  return {
    [`${prefixClass}-interal`]: true,
    [`${prefixClass}-bordered`]: props.bordered,
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
  visible: paginationVisible,
} = usePagination(props);

// 同步分页参数
watch(
  () => paginationProps.value,
  (pagination) => {
    const { current, pageSize, total } = pagination;
    tableState.value.pagination?.update(
      current ?? 1,
      pageSize ?? 10,
      total ?? 0,
    );
  },
  { immediate: true, deep: true },
);

const paginationBind = computed(() => {
  return {
    class: `s-pagination s-pagination-${paginationProps.value.horizontal || "right"}`,
    onChange: onPaginationChange,
    onShowSizeChange: onPaginationChange,
    ...paginationProps.value,
  };
});
</script>

<style lang="less" scoped>
.s-table-interal {
  display: flex;
  flex-direction: column;
}
</style>
