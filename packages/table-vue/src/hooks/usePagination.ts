import type { RawData, TablePaginationProps, TableProps, Option } from "../typing";
import type { ITablePagination } from "@scode/table-state"
import { computed, ref, toRef, type Ref, nextTick } from "vue";
import { DefaultPagination } from "../config";
import { useStateInject } from "./useState";

// 默认 10 条数据每页
export const Default_Page_Size = 10;

export function normalizePagination(
  pagination?: Partial<TablePaginationProps> | boolean,
  dataSource?: RawData[],
): Option<ITablePagination> {

  if (!pagination) return null;

  if (typeof pagination === 'boolean') {
    return {
      page: 1,
      size: Default_Page_Size,
      total: dataSource?.length ?? 0,
    }
  }

  return {
    page: pagination.current ?? 1,
    size: pagination.pageSize ?? Default_Page_Size,
    total: pagination.total ?? 0,
  }
}

export function usePagination(tableProps: TableProps) {
  const { callback } = useStateInject();

  const paginationVisible = computed(() => tableProps.pagination !== false);

  // 初始化 pagination 属性。
  const pagination =
    typeof tableProps.pagination === "object"
      ? (toRef(tableProps, "pagination") as Ref<TablePaginationProps>)
      : ref<TablePaginationProps>(
        tableProps.pagination ? { ...DefaultPagination } : {},
      );

  if (typeof tableProps.pagination) {
    Object.assign(pagination.value, DefaultPagination, tableProps.pagination);
  }

  // 分页事件
  function onChange(page: number, size: number) {
    const new_pagination = { current: page, pageSize: size };
    if (typeof tableProps.pagination === "object") {
      Object.assign(tableProps.pagination, new_pagination);
    }
    Object.assign(pagination.value, new_pagination);

    // 确保 pagination 更新过生效
    nextTick(() => {
      callback["updateViewportDataSource"]?.();
    });
  }

  const mergedPagination = computed(() => {
    return {
      ...pagination.value,
      total: Math.max(
        pagination.value.total || 0,
        tableProps.dataSource?.length ?? 0,
      ),
    };
  });

  return {
    props: mergedPagination,
    onChange,
    visible: paginationVisible,
  };
}
