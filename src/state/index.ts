// FIXME: 管理表格状态的类。V1 版本通过 ts 实现。V2 版本通过 rust 实现，以确保更小的内存和更快的逻辑。

import { RowData, TableColumn } from "../table/typing";

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

  // 配置的默认宽度
  defaultWidth?: number;

  // 调整过后的宽度
  resizedWidth?: number;
};

export type Scroll = {
  x?: number;

  y?: number,
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

  y: number;
}

export type BBox = {
  width: number,

  height: number,
}

export class TableState {
  // 表格的高度和宽度。
  //    宽度：所有列配置的宽度合
  //    高度：所有行的高度之和 + 表头的高度
  bbox: BBox = { width: 0, height: 0 };

  // 数据可视区域的高度和宽度
  //    宽度：表格容器的可见宽度
  //    高度：如果表头固定：容器高度 - 表头高度。 否则：
  //      容器高度。
  viewport: BBox = { width: 0, height: 0 };

  // 表头的元数据，该元数据依据之后一列的配置
  colMeta: Record<string, ColMeta> = {};

  rowMetaIndexes: RowMetaKey[] = [];
  rowMeta: Record<RowMetaKey, RowMeta> = {};

  dataSource: RowData[] = [];
  columns: TableColumn[] = [];

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

  // 覆盖数据源
  coverDataSource(dataSource: RowData[]) {
    this.dataSource = dataSource;
  }

  updateColumns(columns: TableColumn[]) {
    // TODO: 可以确定列宽？
    this.columns = columns;
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
    // TODO: 根据数据源计算行的元数据
    const Row_Height = 52;
    for (let rowIndex = 0; rowIndex < dataSource.length; rowIndex++) {
      this.rowMetaIndexes.push(rowIndex);
      // TODO: 需要考虑树状结构
      this.rowMeta[rowIndex] = {
        key: rowIndex,
        rowIndex,
        height: Row_Height,
        y: rowIndex * Row_Height,
      }
    }

    this.updateBBox(0, dataSource.length * Row_Height)
  }

  // 更新 viewport，当可视窗口更新后，用户需要调用 getViewportDataSource 重新获取数据。
  updateViewport(width: number, height: number) {
    this.viewport = Object.assign({}, this.viewport ?? {}, {
      width, height
    });
  }

  // 更新 table 的 bbox。
  updateBBox(width: number, height: number) {
    this.bbox = Object.assign({}, this.bbox ?? {}, {
      width, height
    });
  }

  // 更新行的元数据
  // TODO: 需要考虑当拖动行数据时，这个元数据应该怎么变更会比较快
  updateRowMeta(key: RowMetaKey, height: number) {
    const rowMeta = this.rowMeta[key];
    if (!rowMeta) return;

    const originRowHeight = rowMeta.height ?? 0;
    rowMeta.height = height;
    // 如果实际的高度值和预估的高度值偏差为 0，则不做处理。
    if (height === originRowHeight) return;

    const offsetHeight = height - originRowHeight;
    const rowIndex = rowMeta.rowIndex;

    for (let i = rowIndex + 1; i < this.rowMetaIndexes.length; i++) {
      const nextRowMeta = this.rowMeta[this.rowMetaIndexes[i]]
      if (nextRowMeta) {
        nextRowMeta.y += offsetHeight;
      }
    }

    const lastRowMeta = this.rowMeta[this.rowMetaIndexes[this.rowMetaIndexes.length - 1]];
    lastRowMeta && this.updateBBox(this.bbox.width ?? 0, lastRowMeta.height + lastRowMeta.y)
    console.log(this.bbox)
  }

  // 执行交换两行数据
  processExchangeRowData(modifiedRowIndex: number, originRowIndex: number) {
    if (modifiedRowIndex === originRowIndex) return;

    // TODO: 交换两行数据, 两个行数据索引之间的 Y 坐标会发生改变。
  }

  dynamicUpdateCellMeta() {
    // TODO: 动态更新单元格的元数据
  }


  getViewportColumns() {
    // TODO: 获取可视窗口的列, 这里 V1 不做考虑。
    return [];
  }

  getViewportDataSource(scrollY: number): RowData[] {
    // 1. 表头固定。
    // TODO: 根据可视窗口获取数据
    return [];
  }
}