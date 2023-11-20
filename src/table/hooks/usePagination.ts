import { computed, reactive } from "vue";
import { TablePaginationProps, TableProps } from "../typing";

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
  }

  return {
    props,
    onChange
  }
}