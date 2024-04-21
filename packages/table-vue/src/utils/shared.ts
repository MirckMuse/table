import type { TableColumn } from "@scode/table-typing";
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

export function genColumnGrid(
  lastColumns: TableColumn[],
  getWidth: (column: TableColumn) => number | undefined,
  viewport_width?: number
) {
  viewport_width = viewport_width || 0;

  const widthMeta = lastColumns.map(col => ({ col, width: getWidth(col) ?? 0 }));

  // 计算的列宽大于容器宽度则，则按照设置的宽度渲染
  if (!(widthMeta.reduce((width, meta) => width + meta.width, 0) > viewport_width)) {
    // 小于则走均分逻辑
    let setupWidthCols = widthMeta.filter(meta => Number(meta.col.width) > 0);
    let nonWidthCols = widthMeta.filter(meta => !(Number(meta.col.width) > 0));

    const residualWidth = viewport_width - setupWidthCols.reduce((width, meta) => width + meta.width, 0);
    let allNonWidth = nonWidthCols.reduce((width, meta) => width + meta.width, 0);
    nonWidthCols.forEach((meta) => {
      meta.width = Math.round(meta.width * residualWidth / allNonWidth);
    });
    allNonWidth = nonWidthCols.reduce((width, meta) => width + meta.width, 0);
    const lastNonWidthCol = nonWidthCols[nonWidthCols.length - 1];
    if (lastNonWidthCol) {
      lastNonWidthCol.width = residualWidth - allNonWidth + lastNonWidthCol.width;
    }
  }

  return widthMeta;
}

// 有设置宽度则按照设置宽度来，没有设置，则均分
export function genGridTemplateColumns(
  lastColumns: TableColumn[],
  getWidth: (column: TableColumn) => number | undefined,
  viewport_width?: number
) {
  return genColumnGrid(
    lastColumns,
    getWidth,
    viewport_width
  ).map(meta => `${meta.width}px`).join(' ');
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

export function stopPropagation($event: Event) {
  $event.stopPropagation();
}