/**
 * 二分搜索一个范围内数据的索引, 当精确值找不到时，则返回一个近似值的索引
 * @param sortedArray 排序后的数组
 * @param compareFn  0 - 当前值  大于0 - 右区间 小于0 - 左区间
 * @returns
 */
export declare function binaryFindIndexRange<T = unknown>(sortedArray: T[], compareFn: (value: T, index: number) => number): number;
