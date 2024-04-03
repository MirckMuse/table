import { groupBy, isNil } from "lodash-es";
import { TableColStateCenter } from "./col";
import { TableRowStateCenter, type TableRowStateOrNull } from "./row";
import { adjustScrollOffset, rowKeyCompare } from "./shared";
import { Viewport, type IViewport } from "./viewport";
import type { RowData, GetRowKey, TableColumn, RowKey, FilterState, SorterState } from "@scode/table-typing"
import { binaryFindIndexRange } from "@scode/table-shared";

export interface TableStateOption {
  rowDatas?: RowData[];

  getRowKey?: GetRowKey;

  columns?: TableColumn[];

  viewport?: IViewport;

  rowHeight?: number;

  childrenColumnName?: string;
}


export type HoverState = {
  rowIndex: number;

  rowKey: RowKey;

  colKey: string;
}

const RowHeight = 55;

export type Scroll = {
  left: number;

  top: number,
}

export type RowDataRange = {
  startIndex: number;

  endIndex: number;
};

export type OuterRowMeta = {
  rowKey: RowKey;

  height: number;
}

// 表格的状态类
export class TableState {
  viewport: Viewport;

  scroll: Scroll = { left: 0, top: 0 };

  colStateCenter: TableColStateCenter;

  rowStateCenter: TableRowStateCenter;

  rowOffset = {
    top: 0,
    bottom: 0
  };

  hoverState: HoverState = {
    rowIndex: -1,
    rowKey: -1,
    colKey: ""
  }

  childrenColumnName = "children";

  private fixedRowHeight = false;

  get isFixedRowHeight() {
    return this.fixedRowHeight;
  }

  constructor(option: TableStateOption) {
    this.viewport = new Viewport();
    this.colStateCenter = new TableColStateCenter({ tableState: this });
    this.fixedRowHeight = !isNil(option.rowHeight);
    this.rowStateCenter = new TableRowStateCenter({
      tableState: this,
      rowHeight: option.rowHeight ?? RowHeight,
      getRowKey: option.getRowKey
    })
    this.init(option);
  }

  private init(option: TableStateOption) {
    this.childrenColumnName = option.childrenColumnName ?? "children";
    Object.assign(this.viewport, option.viewport ?? {});
    if (option.columns?.length) {
      this.updateColumns(option.columns);
    }

    if (option.rowDatas?.length) {
      this.updateRowDatas(option.rowDatas)
    }
  }

  updateColumns(columns: TableColumn[]) {
    this.colStateCenter.updateColumns(columns);
  }

  // 更新行数据
  updateRowDatas(rowDatas: RowData[]) {
    this.rowStateCenter.updateRowDatas(rowDatas);
  }

  updateRowMetas(rowMetas: OuterRowMeta[]) {

    // 固定行高，无需更新行 meta。
    if (this.isFixedRowHeight) return;

    const groupedCellMetas = groupBy(rowMetas, "rowKey");

    let offsetHeight = 0;
    let firstRowState: TableRowStateOrNull = null;

    const rowKeys = Object.keys(groupedCellMetas)
    for (const rowKey of rowKeys) {
      const rowState = this.rowStateCenter.getStateByRowKey(rowKey);
      if (rowState) {
        firstRowState = firstRowState || rowState;
        const fistStateMeta = firstRowState.getMeta();
        const currentStateMeta = rowState.getMeta();

        if (firstRowState.getMeta().deep > currentStateMeta.deep) {
          firstRowState = rowState;
        } else if (fistStateMeta.deep === currentStateMeta.deep && fistStateMeta.index > currentStateMeta.index) {
          firstRowState = rowState;
        }

        const outerRowMetas = groupedCellMetas[rowKey];
        const rowHeight = Math.max(...outerRowMetas.map(meta => meta.height));

        offsetHeight = offsetHeight + (rowHeight - rowState.getMeta().height);
        rowState.updateHeight(rowHeight);
      }
    }


    if (offsetHeight === 0) return;

    if (firstRowState) {
      // let start = performance.now();

      this.rowStateCenter.resetYIndexes();
      // console.log(`resetYIndexes spend Time ${performance.now() - start}ms`)

    }
    this.viewport.scrollHeight = this.viewport.scrollHeight + offsetHeight;
  }

  updateViewport(width: number, height: number) {
    Object.assign(this.viewport ?? {}, { width, height });
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


  // 筛选或者排序后滚动到顶部
  scrollToTopAfterFilterOrSorter = true;

  /**
   * 更新筛选状态
   * @returns 
   */

  updateFilterStates(filterStates: FilterState[]) {
    this.rowStateCenter.updateFilterStates(filterStates);

    if (this.scrollToTopAfterFilterOrSorter) {
      this.scroll.top = 0;
    }

    // 筛选后需要更新可滚动距离
    const { flattenRowKeys, flattenYIndexes } = this.rowStateCenter;
    const lastRowKey = flattenRowKeys[flattenRowKeys.length - 1];
    const lastRowY = flattenYIndexes[flattenYIndexes.length - 1] ?? 0;
    const lastRowHeight = this.rowStateCenter.getStateByRowKey(lastRowKey)?.getMeta().height ?? 0;
    this.viewport.scrollHeight = lastRowY + lastRowHeight;
  }

  updateSorterStates(sorterStates: SorterState[]) {
    this.rowStateCenter.updateSorterStates(sorterStates);
    if (this.scrollToTopAfterFilterOrSorter) {
      this.scroll.top = 0;
    }
  }

  getViewportRowDataRange() {
    const range: RowDataRange = { startIndex: 0, endIndex: 0 };

    const _createCompare = (targetY: number) => {
      return (y: number) => {
        return targetY - y;
      }
    }

    const { flattenYIndexes, flattenRowKeys } = this.rowStateCenter;

    const dataSourceLength = flattenRowKeys.length;

    range.startIndex = binaryFindIndexRange(flattenYIndexes, _createCompare(this.scroll.top));

    if (range.startIndex === -1) {
      range.startIndex = flattenYIndexes.length - 1
    }

    const endY = this.scroll.top + this.viewport.height;

    const getY = (index: number) => {
      const y = flattenYIndexes[index] ?? (flattenYIndexes[index - 1] + this.rowStateCenter.getRowHeightByRowKey(flattenRowKeys[index]))
      flattenYIndexes[index] = y;
      return y;
    }

    for (let i = range.startIndex; i < flattenRowKeys.length - 1; i++) {
      range.endIndex = i;
      const currntY = getY(i)
      if (endY < currntY) {
        break;
      }
    }

    this.rowStateCenter.flattenYIndexes = flattenYIndexes;

    range.endIndex = Math.max(range.endIndex, 0);

    const buffer = Math.ceil((range.endIndex - range.startIndex + 1) / 2);
    range.startIndex = Math.max(0, range.startIndex - buffer);
    range.endIndex = Math.min(dataSourceLength - 1, range.endIndex + buffer);
    return range;
  }

  _calculateRowOffset(rowIndex: number) {
    return this.rowStateCenter.flattenYIndexes[rowIndex] ?? 0;
  }

  // 根据可视索引，更新上下的偏移距离。
  updateRowOffsetByRange(range: RowDataRange) {
    const dataSourceLength = this.rowStateCenter.flattenRowKeys.length;
    // 这里计算获取的时候同时计算行偏移量，有点不够干净
    Object.assign(this.rowOffset, {
      top: this._calculateRowOffset(range.startIndex - 1),
      bottom: this._calculateRowOffset(dataSourceLength - 1) - this._calculateRowOffset(range.endIndex)
    });
  }

  // 后驱可视窗口的数据 - 固定行高
  private getViewportDataSourceByFixRowHeight(): RowData[] {
    const range: RowDataRange = { startIndex: 0, endIndex: 0 };
    const { rowHeight, flattenRowKeys } = this.rowStateCenter;

    range.startIndex = Math.floor(this.scroll.top / rowHeight) - 1;
    range.endIndex = Math.floor((this.scroll.top + this.viewport.height) / rowHeight) + 1;

    range.startIndex = Math.max(range.startIndex, 0);
    range.endIndex = Math.min(
      Math.max(range.startIndex, range.endIndex),
      flattenRowKeys.length - 1
    );

    this.updateRowOffsetByRange(range);

    return Array(range.endIndex - range.startIndex + 1).fill(null).reduce((result, _, index) => {
      const rowIndex = range.startIndex + index;

      const rowData = this.rowStateCenter.getRowDataByFlattenIndex(rowIndex);

      if (rowData) {
        result.push(rowData);
      }

      return result;
    }, []);
  }

  // 获取可视窗口的数据 - 自动行高
  private getViewportDataSourceByAutoRowHeight(): RowData[] {
    const range = this.getViewportRowDataRange();

    this.updateRowOffsetByRange(range);

    return Array(range.endIndex - range.startIndex + 1).fill(null).reduce((result, _, index) => {
      const rowIndex = range.startIndex + index;

      const rowData = this.rowStateCenter.getRowDataByFlattenIndex(rowIndex);

      if (rowData) {
        result.push(rowData);
      }

      return result;
    }, []);
  }

  // 获取可视范围的数据, // TODO: 可以优化的，减少一次 if 判断
  getViewportDataSource(): RowData[] {
    console.log('getViewportDataSource')
    if (this.isFixedRowHeight) {
      return this.getViewportDataSourceByFixRowHeight();
    }

    return this.getViewportDataSourceByAutoRowHeight();
  }

  getViewportHeightList(viewportDataSource: RowData[]): number[] {
    return viewportDataSource.map(rowData => {
      return this.rowStateCenter.getRowHeightByRowData(rowData);
    });
  }

  isEmpty() {
    return !!this.rowStateCenter.flattenRowKeys.length;
  }

  getRowDataChildren(rowData: RowData): RowData[] | undefined {
    return rowData[this.childrenColumnName] as RowData[]
  }

  private expandedRowKeys: RowKey[] = [];

  // 更新展开列
  updateExpandedRowKeys(expandedRowKeys: RowKey[]) {
    const rowStateCenter = this.rowStateCenter;

    const sortedExpandedRowKeysByDeep = expandedRowKeys.sort((prev, next) => {
      return (rowStateCenter.getStateByRowKey(prev)?.getMeta()?.deep ?? -1) - (rowStateCenter.getStateByRowKey(next)?.getMeta()?.deep ?? -1)
    });

    // FIXME: 这里需要重写。
    const expandedRowKeySet = new Set<RowKey>(sortedExpandedRowKeysByDeep);

    const insertedRowKeySet = new Set<RowKey>([]);

    while (expandedRowKeySet.size) {
      const rowKey = Array.from(expandedRowKeySet).find(key => rowStateCenter.getRowDataByRowKey(key));

      if (!isNil(rowKey)) {
        expandedRowKeySet.delete(rowKey);
        const record = rowStateCenter.getRowDataByRowKey(rowKey);

        if (record) {
          const parentMeta = rowStateCenter.getStateByRowKey(rowKey)?.getMeta();
          const children = this.getRowDataChildren(record) ?? [];

          if (children.length) {
            children.forEach((row, rowIndex) => {
              const rowState = rowStateCenter.insertRowState(row, {
                index: rowIndex,
                deep: parentMeta ? (parentMeta.deep + 1) : 0,
                _sort: `${parentMeta ? parentMeta._sort : "0"}-${String(rowIndex)}`
              })
              insertedRowKeySet.add(rowState.getMeta().key)
            })
          }
        }
      }
    }

    // FIXME: 展开和收缩后 y 的变化

    // 最后才更新展开列
    this.expandedRowKeys = expandedRowKeys;
    this.updateFlattenRowKeysByExpandedRowKeys();
  }

  private updateFlattenRowKeysByExpandedRowKeys() {
    const rowStateCenter = this.rowStateCenter;

    function _getSort(rowKey: RowKey) {
      return rowStateCenter.getStateByRowKey(rowKey)?.getMeta()._sort ?? ''
    }

    const sortedExpandedRowKeys = this.expandedRowKeys.sort((prev, next) => {
      return rowKeyCompare(_getSort(prev), _getSort(next))
    })

    const newflattenRowKeys: RowKey[] = [];
    let children: RowData[] = [];
    let _rawRowIndex = 0;
    let _expandRowIndedx = 0;
    while (_rawRowIndex < rowStateCenter.rawRowKeys.length || children.length) {
      const childrenTop = children.shift();
      const rowKey = childrenTop
        ? rowStateCenter.getStateByRowData(childrenTop)?.getMeta().key
        : rowStateCenter.rawRowKeys[_rawRowIndex];
      if (!childrenTop) {
        _rawRowIndex++;
      }

      if (rowKey === sortedExpandedRowKeys[_expandRowIndedx]) {
        _expandRowIndedx++;

        const rowData = rowStateCenter.getRowDataByRowKey(rowKey);
        if (rowData) {
          children = (this.getRowDataChildren(rowData) ?? []).concat(children);
        }

      }
      rowKey && newflattenRowKeys.push(rowKey);
    }

    this.rowStateCenter.flattenRowKeys = newflattenRowKeys;
  }
}
