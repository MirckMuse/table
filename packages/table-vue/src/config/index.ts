import type { TablePaginationProps } from "../typing";

// 列分隔符
export const ColKeySplitWord = "__$$__"

// 默认分页配置
export const DefaultPagination: Partial<TablePaginationProps> = {
  vertical: "bottom",
  horizontal: 'right',
  current: 1,
  pageSize: 10,
  total: 0,
}
