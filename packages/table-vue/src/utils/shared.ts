import type { TableColumn } from "@stable/table-typing";
import { isObject } from "lodash-es";
import { EXPAND_COLUMN } from "./constant";

export function isNestColumn(column: TableColumn): boolean {
  return (column.children ?? []).length > 0;
}

export function getDFSLastColumns(columns: TableColumn[]): TableColumn[] {
  return columns.reduce<TableColumn[]>((cols, col) => {
    if (isNestColumn(col)) {
      return cols.concat(...getDFSLastColumns(col.children!));
    }

    return cols.concat(col);
  }, []);
}

export function px2Number(target: string): number {
  return Number(target.replace("px", ""));
}

export function noop() { }

export function genGridTemplateColumns(lastColumns: TableColumn[]) {
  return lastColumns.map(column => {
    let width = column.width;
    if (typeof width === "number") {
      width = `${width}px`;
    }
    return width ?? 'minmax(120px, 1fr)'
  }).join(" ");
}

/**
 * 将传入的参数转换为数组
 * @param target - 需要转换的参数
 * @returns 转换后的数组
 */
export function toArray<T = any>(target: T): T[] {
  return Array.isArray(target) ? target : [target];
}

export function isShowTitle(column?: TableColumn) {
  const ellipsis = column?.ellipsis

  return isObject(ellipsis) ? ellipsis?.showTitle : !!ellipsis
}

// 是否是展开、选择列
export function isSpecialColumn(column: unknown) {
  return column === EXPAND_COLUMN
}


/**
 * 二分搜索数据的索引, 精确查找
 * @param sortedArray 排序后的数组
 * @param compareFn  0 - 当前值  大于0 - 右区间 小于0 - 左区间
 * @returns 
 */
export function binaryFindIndex<T = unknown>(sortedArray: T[], compareFn: (value: T, index: number) => number): number {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    const middleIndex = Math.floor((left + right) / 2);
    const middleValue = sortedArray[middleIndex];

    const compare = compareFn(middleValue, middleIndex);

    if (compare === 0) {
      return middleIndex;
    } else if (compare > 0) {
      left = middleIndex + 1;
    } else {
      right = middleIndex - 1;
    }
  }

  return -1;
}

/**
 * 二分搜索一个范围内数据的索引, 当精确值找不到时，则返回一个近似值的索引
 * @param sortedArray 排序后的数组
 * @param compareFn  0 - 当前值  大于0 - 右区间 小于0 - 左区间
 * @returns 
 */
export function binaryFindIndexRange<T = unknown>(sortedArray: T[], compareFn: (value: T, index: number) => number): number {
  let left = 0;
  let right = sortedArray.length - 1;

  let rangeIndex = null;

  while (left <= right) {
    const middleIndex = Math.floor((left + right) / 2);
    const middleValue = sortedArray[middleIndex];
    const compare = compareFn(middleValue, middleIndex);

    if (compare === 0) {
      return middleIndex
    } else if (compare > 0) {
      left = middleIndex + 1
    } else {
      if (rangeIndex === null || rangeIndex > middleIndex) {
        rangeIndex = middleIndex;
      }
      right = middleIndex - 1;
    }
  }

  return rangeIndex ?? -1;
}