import type { TablePaginationProps, TableProps } from "../typing";
import { ref, toRef, type Ref } from "vue";
import { DefaultPagination } from '../config'

// 默认 10 条数据每页
export const Default_Page_Size = 10;

export function usePagination(tableProps: TableProps) {
  // 初始化 pagination 属性。
  const pagination = typeof tableProps.pagination === "object"
    ? toRef(tableProps, "pagination") as Ref<TablePaginationProps>
    : ref<TablePaginationProps>(tableProps.pagination ? { ...DefaultPagination } : {})

  if (typeof tableProps.pagination) {
    Object.assign(pagination.value, DefaultPagination, tableProps.pagination)
  }

  // 分页事件
  function onChange(page: number, size: number) {
    // TODO:
    console.log(pagination.value);
  }

  return {
    props: pagination,
    onChange
  }
}