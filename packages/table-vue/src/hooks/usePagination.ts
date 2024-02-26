import type { TablePaginationProps, TableProps } from "../typing";
import { computed, reactive } from "vue";

// 默认 10 条数据每页
export const Default_Page_Size = 10;

export function usePagination(tableProps: TableProps) {
  const props = computed<TablePaginationProps>(() => {
    // TODO:
    return {
      vertical: "bottom",
      horizontal: "right"
    }
  });

  const state = reactive({
    page: 1,
    size: Default_Page_Size
  });

  // 分页事件
  function onChange(page: number, size: number) {
    // TODO:
    console.log(state);
  }

  return {
    props,
    onChange
  }
}