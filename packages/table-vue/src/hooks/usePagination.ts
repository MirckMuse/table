import type { TablePaginationProps, TableProps } from "../typing";
import { computed, ref, toRef, type Ref } from "vue";
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
    const new_pagination = { current: page, pageSize: size };
    if (typeof tableProps.pagination === 'object') {
      Object.assign(tableProps.pagination, new_pagination);
    }
    Object.assign(pagination.value, new_pagination);
  }

  const mergedPagination = computed(() => {
    return {
      ...pagination.value,
      total: Math.max(
        pagination.value.total || 0,
        tableProps.dataSource?.length ?? 0
      )
    }
  })

  return {
    props: mergedPagination,
    onChange
  }
}