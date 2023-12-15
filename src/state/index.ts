// FIXME: 管理表格状态的类。V1 版本通过 ts 实现。V2 版本通过 rust 实现，以确保更小的内存和更快的逻辑。

import { isNil } from "lodash-es";
import { ColKeySplitWord } from "../table/config";
import { RowData, TableColumn, TableColumnFixed } from "../table/typing";
import { getDFSLastColumns, isNestColumn, runIdleTask } from "../table/utils";
import { chunk } from "lodash-es"
import { objectEntries } from "@vueuse/core";

export type Viewport = {
  width: number,
  height: number,
  scrollX: number,
  scrollY: number,
}

// TODO:
// 1. 树形结构的元数据怎么存储？
//    case 1: 展示层面打平到界面中，高度则以深度为 key 值存储
//    case 2: 展示层面嵌套在 tr 中。高度以最外层的高度为准。
// 2. 嵌套表格的高度计算呢

export type ColMeta = {
  // 根据 column 的 dataIndex 和 index 生成唯一 key。当存在嵌套时，则添加深度作为条件。
  key: string;

  deep?: number;

  colSpan?: number;

  rowSpan?: number;

  isLast?: boolean;
};

export type Scroll = {
  left: number;

  top: number,
}

export interface ITableStateOption {
  dataSource?: RowData[];

  columns?: TableColumn[];

  viewport?: BBox;
}

export type RowMetaKey = number | string;


export type RowMeta = {
  // 以行的索引作为 key 值。
  key: RowMetaKey;

  rowIndex: number;

  height: number;

  heightMap: Record<string, number>;

  y: number;
}

export type BBox = {
  width: number,

  height: number,

  scrollWidth: number,

  scrollHeight: number,
}

function bfsFlattenColumns<T = any>(columns: TableColumn[], callback?: (column: TableColumn) => T): T[] {
  let stack = ([] as TableColumn[]).concat(columns);

  callback = callback ?? (col => col as T);

  const result: T[] = [];
  while (stack.length) {
    const column = stack.shift()!;

    if (isNestColumn(column)) {
      stack = stack.concat(column.children ?? []);
    } else {
      column._s_meta = column._s_meta || {};
      column._s_meta.isLast = true;
    }

    result.push(callback!(column));
  }

  return result;
}

function getMaxDeep(columns: TableColumn[]) {
  return columns.reduce((maxDeep, column) => Math.max(maxDeep, column._s_meta?.deep ?? -Infinity), -Infinity);
}

function updateFlattenColumnsMeta(columns: TableColumn[], maxDeep: number = 1) {
  function _updateMeta(column: TableColumn) {
    column._s_meta = column._s_meta || {};
    if (column._s_meta?.isLast) {
      column._s_meta.rowSpan = maxDeep - (column._s_meta?.deep ?? 1) + 1;
      column._s_meta.colSpan = column._s_meta.colSpan ?? 1;

      let parent = column._s_parent;

      while (parent) {
        parent._s_meta = parent._s_meta || {};
        parent._s_meta.colSpan = parent.children?.reduce((colSpan, col) => colSpan + (col._s_meta?.colSpan ?? 1), 0);
        parent = parent._s_parent;
      }
    } else {
      column._s_meta.rowSpan = 1;
    }
  }

  for (const column of columns) {
    _updateMeta(column);
  }

  return columns;
}

export type HoverState = {
  rowIndex: number;

  colKey: string;
}

const Row_Height = 57;

export class TableState {
  // 数据可视区域的高度和宽度
  //    宽度：表格容器的可见宽度
  //    高度：如果表头固定：容器高度 - 表头高度。 否则：
  //      容器高度。
  viewport: BBox = { width: 0, height: 0, scrollWidth: 0, scrollHeight: 0 };

  scroll: Scroll = { left: 0, top: 0 };

  // 表头的元数据，该元数据依据之后一列的配置
  //  同一行需要高度一致
  colMeta: Record<string, ColMeta> = {};

  rowMetaIndexes: RowMetaKey[] = [];
  rowMeta: Record<RowMetaKey, RowMeta> = {};

  dataSource: RowData[] = [];

  fixedLeftColumns: TableColumn[] = [];
  fixedLeftFlattenColumns: TableColumn[] = [];
  dfsFixedLeftFlattenColumns: TableColumn[] = [];
  columns: TableColumn[] = [];
  centerFlattenColumns: TableColumn[] = [];
  dfsCenterFlattenColumns: TableColumn[] = [];
  fixedRightColumns: TableColumn[] = [];
  fixedRightFlattenColumns: TableColumn[] = [];
  dfsFixedRightFlattenColumns: TableColumn[] = [];
  maxTableHeaderDeep = 1;

  hoverState: HoverState = {
    rowIndex: -1,
    colKey: ""
  }

  // TODO: 缓冲行数
  buffer = 10;

  constructor(option: ITableStateOption) {
    const { dataSource, columns, viewport } = option;
    // 更新可视视图。
    viewport && this.updateViewport(viewport.width, viewport.height);
    this.updateColumns(columns ?? []);
    this.coverDataSource(dataSource ?? []);
    this.initMeta(columns ?? [], dataSource ?? []);
  }

  dataSourceMeta: Record<string, RowData> = {};
  dataSourceLength = 0;

  // 覆盖数据源
  coverDataSource(dataSource: RowData[]) {
    this.dataSourceLength = dataSource.length;
    const chunkSize = 100;
    const chunks = chunk(dataSource, chunkSize);

    const _update = (singleChunk: RowData[], chunkIndex: number) => {
      singleChunk.forEach((row, index) => {
        const rowIndex = index + chunkIndex * chunkSize;
        this.dataSourceMeta[rowIndex] = row;
      })
    }

    _update(chunks[0], 0);
    for (let i = 1; i < chunks.length; i++) {
      runIdleTask(() => _update(chunks[i], i));
    }
  }

  updateColumns(columns: TableColumn[]) {
    function _standardizationColumn(column: TableColumn, index: number, deep = 1) {
      let ellipsis = column.ellipsis
      if (column.ellipsis && typeof column.ellipsis === 'boolean') {
        ellipsis = { showTitle: true };
      }

      let fixed: TableColumnFixed | undefined = undefined;
      let width = column.width;
      if (column.fixed) {
        if (typeof column.fixed === "boolean") {
          fixed = "left";
        } else {
          fixed = column.fixed;
        }
        width = column.width ?? 120;

        // 同步固定逻辑
        let parent = column._s_parent
        while (parent) {
          parent.fixed = column.fixed;
          parent = parent._s_parent;
        }
      }

      const standardColumn = Object.assign<TableColumn, TableColumn>(column, {
        key: column.key ?? [column.dataIndex, index, deep].join(ColKeySplitWord),
        ellipsis,
        fixed: fixed,
        width,
        colSpan: isNil(column.colSpan) ? 1 : column.colSpan,
      });
      standardColumn._s_meta = standardColumn._s_meta || {};
      if (isNestColumn(standardColumn)) {
        standardColumn.children = standardColumn.children!.map((child, index) => {
          child._s_parent = column;
          return _standardizationColumn(child, index, deep + 1)
        })
      }
      standardColumn._s_meta.deep = deep;
      return standardColumn
    }

    const { left, center, right } = columns
      .map((column, index) => _standardizationColumn(column, index))
      .reduce<{ left: TableColumn[], right: TableColumn[], center: TableColumn[] }>(
        (result, column) => {
          if (column.fixed === true || column.fixed === "left") {
            result.left.push(column);
          } else if (column.fixed === "right") {
            result.right.push(column);
          } else {
            result.center.push(column);
          }
          return result;
        },
        { left: [], right: [], center: [] }
      )
    const leftFlattenColumns = bfsFlattenColumns(left);
    const centerFlattenColumns = bfsFlattenColumns(center);
    const rightFlattenColumns = bfsFlattenColumns(right);

    this.maxTableHeaderDeep = getMaxDeep([...leftFlattenColumns, ...centerFlattenColumns, ...rightFlattenColumns])
    this.fixedLeftColumns = left;
    this.fixedLeftFlattenColumns = updateFlattenColumnsMeta(leftFlattenColumns, this.maxTableHeaderDeep);
    this.dfsFixedLeftFlattenColumns = getDFSLastColumns(left);
    this.columns = center;
    this.dfsCenterFlattenColumns = getDFSLastColumns(center);
    this.centerFlattenColumns = updateFlattenColumnsMeta(centerFlattenColumns, this.maxTableHeaderDeep);
    this.fixedRightColumns = right;
    this.dfsFixedRightFlattenColumns = getDFSLastColumns(right);
    this.fixedRightFlattenColumns = updateFlattenColumnsMeta(rightFlattenColumns, this.maxTableHeaderDeep);
  }

  // 初始化元数据
  initMeta(columns: TableColumn[], dataSource: RowData[]) {
    this.initColMeta(columns);
    this.initRowMeta(dataSource);
  }

  initColMeta(columns: TableColumn[]) {
    // TODO: 根据列的配置计算列的元数据
  }

  initRowMeta(dataSource: RowData[]) {
    const lastColumnKeys: string[] = ([] as TableColumn[]).concat(this.dfsFixedLeftFlattenColumns, this.dfsCenterFlattenColumns, this.dfsFixedRightFlattenColumns)
      .filter(col => col._s_meta?.isLast && col.key)
      .map(col => {
        return col.key!
      });

    // 创建高度映射
    function _createHeightMap(keys: string[]) {
      return keys.reduce<Record<string, number>>((map, key) => {
        map[key] = Row_Height;
        return map;
      }, {})
    }

    for (let rowIndex = 0; rowIndex < dataSource.length; rowIndex++) {
      this.rowMetaIndexes.push(rowIndex);
      // TODO: 需要考虑树状结构
      this.rowMeta[rowIndex] = {
        key: rowIndex,
        rowIndex,
        height: Row_Height,
        heightMap: _createHeightMap(lastColumnKeys),
        y: rowIndex * Row_Height
      }
    }
  }

  // 更新 viewport，当可视窗口更新后，用户需要调用 getViewportDataSource 重新获取数据。
  updateViewport(width: number, height: number) {
    this.viewport = Object.assign({}, this.viewport ?? {}, {
      width, height
    });
  }

  updateScroll() {
    const { scrollHeight, scrollWidth, width, height } = this.viewport;

    const maxXMove = scrollWidth - width;
    const maxYMove = scrollHeight - height;
    this.scroll.left = Math.min(this.scroll.left, maxXMove);
    this.scroll.top = Math.min(this.scroll.top, maxYMove);
  }

  // 更新行的元数据
  updateRowMeta(rowIndex: number, column: TableColumn, height: number) {
    const key = this.rowMetaIndexes[rowIndex];

    const rowMeta = this.rowMeta[key];
    if (!rowMeta) return;
    if (!column.key || isNil(rowMeta.heightMap[column.key])) return;

    const previewMeta = this.rowMeta[this.rowMetaIndexes[rowIndex - 1]] ?? null;

    rowMeta.heightMap[column.key] = height;
    const rowHeight = Math.max(...Object.values(rowMeta.heightMap));

    Object.assign(rowMeta, {
      height: rowHeight,
      y: (previewMeta?.height ?? 0) + (previewMeta?.y ?? 0),
    });
  }

  // 执行交换两行数据
  processExchangeRowData(modifiedRowIndex: number, originRowIndex: number) {
    if (modifiedRowIndex === originRowIndex) return;

    // 需要交换 rowIndex 对应的key 值
  }

  dynamicUpdateCellMeta() {
    // TODO: 动态更新单元格的元数据
    // 行高需要实时计算

  }


  getViewportColumns() {
    // TODO: 获取可视窗口的列, 这里 V1 不做考虑。
    return [];
  }

  rowOffset = {
    top: 0,
    bottom: 0
  };

  _calculateRowOffset(rowIndex: number) {
    const rowKey = this.rowMetaIndexes[rowIndex];
    const meta = this.rowMeta[rowKey];

    if (meta) {
      return meta.y + meta.height;
    }
    return 0;
  }

  getViewportDataSource(): RowData[] {
    const dataSourceLength = this.dataSourceLength;


    const range = {
      startIndex: 0,
      endIndex: 0
    }

    for (let i = 0; i < dataSourceLength; i++) {
      const rowKey = this.rowMetaIndexes[i];
      const meta = this.rowMeta[rowKey];

      if (meta.y > this.scroll.top) {
        range.startIndex = meta.rowIndex;
        break;
      }
    }
    let height = this.scroll.top + this.viewport.height;
    for (let i = range.startIndex; i < dataSourceLength; i++) {
      const rowKey = this.rowMetaIndexes[i];
      const meta = this.rowMeta[rowKey];

      if (meta.y > height) {
        range.endIndex = meta.rowIndex;
        break;
      }
    }

    if (range.endIndex === 0) {
      range.endIndex = dataSourceLength - 1;
    }

    range.startIndex = Math.max(0, range.startIndex - this.buffer);
    range.endIndex = Math.min(dataSourceLength - 1, range.endIndex + this.buffer);

    this.rowOffset.top = this._calculateRowOffset(range.startIndex - 1);
    this.rowOffset.bottom = this._calculateRowOffset(dataSourceLength - 1) - this._calculateRowOffset(range.endIndex);
    console.log(this.rowOffset)

    return Array(range.endIndex - range.startIndex + 1).fill(null).map((_, index) => {
      const rowIndex = range.startIndex + index;
      return Object.assign({}, this.dataSourceMeta[rowIndex], {
        _s_row_index: rowIndex
      })
    })
  }

  getViewportHeightList(viewportDataSource: RowData[]): number[] {
    return viewportDataSource.map(item => {
      if (isNil(item._s_row_index)) return 0;

      const key = this.rowMetaIndexes[item._s_row_index];
      return this.rowMeta[key].height ?? 0;
    })

  }
}