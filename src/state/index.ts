// FIXME: 管理表格状态的类。V1 版本通过 ts 实现。V2 版本通过 rust 实现，以确保更小的内存和更快的逻辑。

import { groupBy, isNil } from "lodash-es";
import { RuntimeLog } from "../decorators";
import { ColKeySplitWord } from "../table/config";
import { GetRowKey, RowData, RowKey, TableColumn, TableColumnFixed } from "../table/typing";
import { binaryFindIndexRange, getDFSLastColumns, isNestColumn, isSpecialColumn } from "../table/utils";
import { EXPAND_COLUMN } from "../table/utils/constant";
import { RowMeta, TableRowState, TableRowStateCenter, TableRowStateOrNull } from "./row";


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

// 表格状态的入参
export interface ITableStateOption {
  dataSource?: RowData[];

  getRowKey?: GetRowKey;

  columns?: TableColumn[];

  viewport?: BBox;

  rowHeight?: number;
}

export type RowMetaKey = number | string;

export type OuterRowMeta = {
  rowKey: RowKey;

  height: number;
}


export type CellMeta = {
  // 以行的索引作为 key 值。
  colKey: string;

  rowIndex: number;

  height: number;
}

export type BBox = {
  width: number,

  height: number,

  scrollWidth: number,

  scrollHeight: number,
}

export type RowDataRange = {
  startIndex: number;

  endIndex: number;
};

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

  rowKey: RowKey;

  colKey: string;
}

const Row_Height = 55;

function adjustScrollOffset(offset: number, maxMove: number) {
  return Math.max(0, Math.min(maxMove, offset))
}

const ChunkSize = 100;

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

  getRowData(key: RowKey) {
    return this.rowStateMap.get(key)?.record
  }

  updateRowDataMap(record: RowData) {
  }

  getRowMetaByRowData(rowData?: RowData): RowMeta | null {
    if (!rowData) return null;

    return this.rowStateCenter.getStateByRowData(rowData)?.getMeta() ?? null;
  }

  private expandedRowKeys: RowKey[] = [];

  updateExpandedRowKeys(expandedRowKeys: RowKey[]) {
    // TODO: 这里的 children 需要从外部传递进来;
    const childrenName = "children";
    // FIXME: 这里需要重写。
    const expandedRowKeySet = new Set<RowKey>(expandedRowKeys);

    const rowStateCenter = this.rowStateCenter;

    while (expandedRowKeySet.size) {
      const rowKey = Array.from(expandedRowKeySet).find(key => rowStateCenter.getRowDataByRowKey(key));

      if (!isNil(rowKey)) {
        expandedRowKeySet.delete(rowKey);
        const record = rowStateCenter.getRowDataByRowKey(rowKey)!;

        const parentMeta = rowStateCenter.getStateByRowKey(rowKey)!.getMeta();

        const children = record[childrenName] as RowData[];

        if (children.length) {
          children.forEach((row, rowIndex) => {
            rowStateCenter.insertRowState(row, {
              index: rowIndex,
              deep: parentMeta.deep + 1
            })
          })
        }
      }
    }

    // FIXME: 展开和收缩后 y 的变化

    // 最后才更新展开列
    this.expandedRowKeys = expandedRowKeys;

    const set = new Set<RowKey>(this.expandedRowKeys);

    // FIXME: 这里的性能比较差，需要考虑怎么优化比较好
    let targetRowKeys = ([] as RowKey[]).concat(rowStateCenter.rawRowKeys);

    const result: RowKey[] = [];

    while (targetRowKeys.length && set.size) {
      const rowKey = targetRowKeys.shift();

      if (!isNil(rowKey)) {
        result.push(rowKey);

        if (set.size && set.has(rowKey)) {
          set.delete(rowKey);
          const record = rowStateCenter.getRowDataByRowKey(rowKey);

          const childrenRowKeys = ((record?.[childrenName] ?? []) as RowData[]).map(item => rowStateCenter.getStateByRowData(item)?.getMeta().key).filter(rowKey => !isNil(rowKey)) as RowKey[];
          targetRowKeys = [...childrenRowKeys, ...targetRowKeys];
        }
      }
    }
    rowStateCenter.flattenRowKeys = result.concat(targetRowKeys);

    let prevState: TableRowStateOrNull = null;

    for (const key of rowStateCenter.flattenRowKeys) {
      const prevMeta = prevState?.getMeta()
      const state = rowStateCenter.getStateByRowKey(key) ?? null;
      state?.updatePrev(prevState);
      state?.updateMeta({
        y: (prevMeta?.height ?? 0) + (prevMeta?.y ?? 0)
      });
      prevState = state;
    }
    prevState?.updateNext(null);
  }

  roughRowHeight = Row_Height;

  fixedLeftColumns: TableColumn[] = [];
  fixedLeftFlattenColumns: TableColumn[] = [];
  dfsFixedLeftFlattenColumns: TableColumn[] = [];
  columns: TableColumn[] = [];
  columnMap: Record<string, TableColumn> = {};
  centerFlattenColumns: TableColumn[] = [];
  dfsCenterFlattenColumns: TableColumn[] = [];
  fixedRightColumns: TableColumn[] = [];
  fixedRightFlattenColumns: TableColumn[] = [];
  dfsFixedRightFlattenColumns: TableColumn[] = [];
  maxTableHeaderDeep = 1;

  hoverState: HoverState = {
    rowIndex: -1,
    rowKey: -1,
    colKey: ""
  }

  rowStateCenter: TableRowStateCenter;

  constructor(option: ITableStateOption) {
    // 初始化前置必要参数
    const { rowHeight, getRowKey } = option;
    this.roughRowHeight = rowHeight ? rowHeight : Row_Height;
    this.getRowKey = getRowKey;
    this.rowStateCenter = new TableRowStateCenter({
      rowHeight: this.roughRowHeight,
      getRowKey,
      tableState: this
    })

    this.init(option);
  }

  init(option: ITableStateOption) {
    const { dataSource, columns, viewport } = option;
    // 更新可视视图。
    viewport && this.updateViewport(viewport.width, viewport.height);
    this.updateColumns(columns ?? []);
    this.coverDataSource(dataSource ?? []);
    this.initMeta(columns ?? [], dataSource ?? []);
  }

  getRowKey?: GetRowKey = () => -1;


  // 覆盖数据源
  coverDataSource(dataSource: RowData[]) {
    this.rowStateCenter.updateDataSource(dataSource);
  }

  rowStateMap = new Map<RowKey, TableRowState>();

  // 特殊列映射
  specialColumnMap = new Map<TableColumn, any[]>();

  initSpecialColumnMap() {
    this.specialColumnMap.clear();
  }

  updateSpecialColumnMap(column: TableColumn, specialColumns: any[]) {
    this.specialColumnMap.set(column, specialColumns)
  }

  @RuntimeLog()
  updateColumns(columns: TableColumn[]) {
    this.initSpecialColumnMap();

    const _standardizationColumn = (column: TableColumn, index: number, deep = 1) => {
      if (isSpecialColumn(column)) return column;

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
        let parent = column._s_parent;
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
      if (standardColumn.key) {
        this.columnMap[standardColumn.key] = standardColumn;
      }
      return standardColumn
    }

    let nextMap2SpecialColumn: any[] = [];
    const { left, center, right } = columns
      .map((column, index) => _standardizationColumn(column, index))
      .reduce<{ left: TableColumn[], right: TableColumn[], center: TableColumn[] }>(
        (result, column) => {
          // 特殊列的逻辑
          if (isSpecialColumn(column)) {
            nextMap2SpecialColumn.push(column);
            return result;
          }
          if (nextMap2SpecialColumn.length) {
            this.updateSpecialColumnMap(column, nextMap2SpecialColumn)
          }

          nextMap2SpecialColumn = [];
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
      );
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

    if (this.specialColumnMap.size === 0) {
      this.specialColumnMap.set(this.dfsFixedLeftFlattenColumns[0] ?? this.dfsCenterFlattenColumns[0], [EXPAND_COLUMN])
    }
  }

  // 初始化元数据
  initMeta(columns: TableColumn[], dataSource: RowData[]) {
  }

  // 更新 viewport，当可视窗口更新后，用户需要调用 getViewportDataSource 重新获取数据。
  updateViewport(width: number, height: number) {
    this.viewport = Object.assign({}, this.viewport ?? {}, {
      width, height
    });
  }

  updateScroll() {
    const { scrollHeight, scrollWidth, width, height } = this.viewport;
    const maxXMove = Math.max(0, scrollWidth - width);
    const maxYMove = Math.max(0, scrollHeight - height);
    Object.assign(this.scroll, {
      left: adjustScrollOffset(this.scroll.left, maxXMove),
      top: adjustScrollOffset(this.scroll.top, maxYMove)
    })
  }

  // 更新数据行元数据
  @RuntimeLog()
  updateRowMetas(rowMetas: OuterRowMeta[]) {
    const groupedCellMetas = groupBy(rowMetas, "rowKey");

    let fistState: TableRowState | null = null;

    for (const rowKey of Object.keys(groupedCellMetas)) {
      const rowState = this.rowStateCenter.getStateByRowKey(rowKey);
      if (rowState) {

        if (!fistState) {
          fistState = rowState;
        } else {

          const fistStateMeta = fistState.getMeta();
          const currentStateMeta = fistState.getMeta();

          if (fistState.getMeta().deep > currentStateMeta.deep) {
            fistState = rowState;
          } else if (fistStateMeta.deep === currentStateMeta.deep && fistStateMeta.index > currentStateMeta.index) {
            fistState = rowState;
          }
        }

        const outerRowMetas = groupedCellMetas[rowKey];
        const rowHeight = Math.max(...outerRowMetas.map(meta => meta.height));
        rowState.justUpdateRowHeight(rowHeight);
      }
    }

    fistState?.updateAllNextY();
  }

  // 执行交换两行数据
  processExchangeRowData(modifiedRowIndex: number, originRowIndex: number) {
    if (modifiedRowIndex === originRowIndex) return;

    // 需要交换 rowIndex 对应的key 值
  }


  getViewportColumns() {
    // TODO: 获取可视窗口的列, 这里 V1 不做考虑。
    return [];
  }

  _calculateRowOffset(rowIndex: number) {
    const meta = this.rowStateCenter.getStateByFlattenRowIndex(rowIndex)?.getMeta();

    if (meta) {
      return meta.y + meta.height;
    }
    return 0;
  }

  // 获取可视范围的索引值
  @RuntimeLog()
  getViewportRowDataRange(): RowDataRange {
    const range: RowDataRange = { startIndex: 0, endIndex: 0 };

    const _createCompare = (targetY: number) => {
      return (key: RowKey) => {
        const meta = this.rowStateCenter.getStateByRowKey(key)?.getMeta() ?? null;

        if (!meta) return -1;

        return targetY - meta.y;
      }
    }

    const flattenRowKeys = this.rowStateCenter.flattenRowKeys;

    range.startIndex = binaryFindIndexRange(flattenRowKeys, _createCompare(this.scroll.top));
    const endY = this.scroll.top + this.viewport.height;
    range.endIndex = binaryFindIndexRange(flattenRowKeys, _createCompare(endY));
    range.endIndex = Math.max(range.endIndex, 0);

    const dataSourceLength = flattenRowKeys.length;
    if (range.endIndex === 0) {
      range.endIndex = dataSourceLength - 1;
    }

    const buffer = Math.ceil((range.endIndex - range.startIndex + 1) / 2);
    range.startIndex = Math.max(0, range.startIndex - buffer);
    range.endIndex = Math.min(dataSourceLength - 1, range.endIndex + buffer);

    return range;
  }

  rowOffset = {
    top: 0,
    bottom: 0
  };

  @RuntimeLog()
  // 根据可视索引，更新上下的偏移距离。
  updateRowOffsetByRange(range: RowDataRange) {
    const dataSourceLength = this.rowStateCenter.flattenRowKeys.length;
    // 这里计算获取的时候同时计算行偏移量，有点不够干净
    Object.assign(this.rowOffset, {
      top: this._calculateRowOffset(range.startIndex - 1),
      bottom: this._calculateRowOffset(dataSourceLength - 1) - this._calculateRowOffset(range.endIndex)
    });
  }

  @RuntimeLog()
  // 获取可视范围的数据
  getViewportDataSource(): RowData[] {
    const range = this.getViewportRowDataRange();

    this.updateRowOffsetByRange(range);



    return Array(range.endIndex - range.startIndex + 1).fill(null).reduce((result, _, index) => {
      const rowIndex = range.startIndex + index;

      const rowData = this.rowStateCenter.getRowDataByFlattenRowKeyIndex(rowIndex);

      if (rowData) {
        result.push(rowData);
      }

      return result;
    }, []);
  }

  // 根据可视数据获取高度数据
  getViewportHeightList(viewportDataSource: RowData[]): number[] {
    return viewportDataSource.map(rowData => {
      return this.rowStateCenter.getStateByRowData(rowData)?.getMeta().height ?? 0;
    })
  }

  isEmpty() {
    return this.rowStateCenter.flattenRowKeys.length;
  }
}