import { groupBy, isNil } from "lodash-es";
import { TableColStateCenter } from "./col";
import { TableRowStateCenter, type TableRowStateOrNull } from "./row";
import { adjustScrollOffset, rowKeyCompare } from "./shared";
import { Viewport, type IViewport } from "./viewport";
import type { RowData, GetRowKey, TableColumn, RowKey, FilterState, SorterState } from "@scode/table-typing"
import { binaryFindIndexRange } from "@scode/table-shared";
import { TablePagination, type ITablePagination } from "./pagination";

export interface TableStateOption {
  rowDatas?: RowData[];

  getRowKey?: GetRowKey;

  columns?: TableColumn[];

  pagination?: ITablePagination;

  viewport?: IViewport;

  rowHeight?: number;

  childrenColumnName?: string;

  childrenRowName?: string;
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

function get_max_scroll(viewport: Viewport): [number, number] {
  const { scroll_height, scrollWidth, width, height } = viewport;

  const maxXMove = Math.max(0, scrollWidth - width);
  const maxYMove = Math.max(0, scroll_height - height);

  return [maxXMove, maxYMove];
}

// 表格的状态类
export class TableState {
  viewport: Viewport;

  scroll: Scroll = { left: 0, top: 0 };

  pagination?: TablePagination;

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

  childrenRowName = "children";

  private fixedRowHeight = false;

  get isFixedRowHeight() {
    return this.fixedRowHeight;
  }

  constructor(option: TableStateOption) {
    // 初始化前置参数，确保后续创建事件正常。
    this.before_init(option);

    this.init(option);
  }

  private before_init(option: TableStateOption) {
    if (option.pagination) {
      const { page, size, total } = option.pagination;
      this.pagination = new TablePagination(page, size, total);
    }
    this.fixedRowHeight = !isNil(option.rowHeight);

    // 初始化可视窗口
    this.viewport = new Viewport(this);
    Object.assign(this.viewport, option.viewport ?? {});

    this.childrenColumnName = option.childrenColumnName ?? "children";
    this.childrenRowName = option.childrenRowName ?? "children";

    this.colStateCenter = new TableColStateCenter({ tableState: this });
    this.rowStateCenter = new TableRowStateCenter({
      tableState: this,
      rowHeight: option.rowHeight ?? RowHeight,
      getRowKey: option.getRowKey
    });

  }

  private init(option: TableStateOption) {
    this.init_event();


    if (option.columns?.length) {
      this.updateColumns(option.columns);
    }

    if (option.rowDatas?.length) {
      this.updateRowDatas(option.rowDatas)
    }
  }

  // 获取可视窗口的行数据
  getViewportDataSource: () => RowData[];

  // 初始化事件
  private init_event() {
    // 初始化获取可视窗口数据的事件
    this.getViewportDataSource = this.isFixedRowHeight
      ? this.getViewportDataSourceByFixRowHeight
      : this.getViewportDataSourceByAutoRowHeight
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
      this.rowStateCenter.resetYIndexes();
    }
    this.viewport.scrollHeight = this.viewport.scrollHeight + offsetHeight;
  }

  updateViewport(width: number, height: number) {
    Object.assign(this.viewport ?? {}, { width, height });
  }

  // 更新滚动距离
  updateScroll(deltaX: number, deltaY: number) {
    const { left, top } = this.scroll;
    Object.assign(this.scroll, {
      left: left + deltaX,
      top: top + deltaY
    });

    this.adjustScroll();
  }

  // 校准滚动，确保不会滚动溢出
  adjustScroll() {
    const [maxXMove, maxYMove] = get_max_scroll(this.viewport);

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
    const { flattenYIndexes } = this.rowStateCenter;
    const lastRowY = flattenYIndexes[flattenYIndexes.length - 1] ?? 0;
    this.viewport.scrollHeight = lastRowY;
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
    const { page = 1, size = 10 } = this.pagination ?? {};
    let offset = this._calculateRowOffset((page - 1) * size - 1);
    const dataSourceLength = this.rowStateCenter.flattenRowKeys.length;
    // 这里计算获取的时候同时计算行偏移量，有点不够干净
    Object.assign(this.rowOffset, {
      top: this._calculateRowOffset(range.startIndex - 1) - offset,
      bottom: this._calculateRowOffset(dataSourceLength - 1) - this._calculateRowOffset(range.endIndex)
    });
  }

  // 后驱可视窗口的数据 - 固定行高
  private getViewportDataSourceByFixRowHeight(): RowData[] {
    let preIndex = 0;

    if (this.pagination) {
      const { page, size } = this.pagination;
      preIndex = (page - 1) * size;
    }

    const range: RowDataRange = { startIndex: 0, endIndex: 0 };
    const { rowHeight, flattenRowKeys } = this.rowStateCenter;
    // 分页的偏差高度
    let offsetHeight = preIndex * rowHeight;

    range.startIndex = Math.floor((this.scroll.top + offsetHeight) / rowHeight) - 1;
    range.endIndex = Math.floor((this.scroll.top + this.viewport.height + offsetHeight) / rowHeight) + 1;

    range.startIndex = Math.max(
      range.startIndex,
      preIndex
    );

    range.endIndex = Math.min(
      Math.max(range.startIndex, range.endIndex),
      this.pagination ? this.pagination.page * this.pagination.size - 1 : flattenRowKeys.length - 1,
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

    // 获取行的深度, 用作排序
    const getRowDeep = (rowKey: RowKey) => rowStateCenter.getStateByRowKey(rowKey)?.getMeta()?.deep ?? -1;

    // 获取排序后的的 rowKey，确保子数据一定在父数据之后
    const sortedExpandedRowKeysByDeep = expandedRowKeys.sort((prev, next) => getRowDeep(prev) - getRowDeep(next));

    const expandedRowKeySet = new Set<RowKey>(sortedExpandedRowKeysByDeep);

    // 将展开的子数据生成 state 塞入 center。
    while (expandedRowKeySet.size) {
      const rowKey = Array.from(expandedRowKeySet).find(key => rowStateCenter.getRowDataByRowKey(key));

      if (!isNil(rowKey)) {
        expandedRowKeySet.delete(rowKey);

        const rowData = rowStateCenter.getRowDataByRowKey(rowKey);

        if (rowData) {
          const parentMeta = rowStateCenter.getStateByRowKey(rowKey)?.getMeta();
          const children = this.getRowDataChildren(rowData) ?? [];

          if (children.length) {

            children.forEach((row, rowIndex) => {
              rowStateCenter.insertRowState(row, {
                index: rowIndex,
                deep: parentMeta ? (parentMeta.deep + 1) : 0,
                _sort: `${parentMeta ? parentMeta._sort : "0"}-${String(rowIndex)}`
              });
            });
          }
        }
      }
    }

    // 最后才更新展开列
    this.expandedRowKeys = expandedRowKeys;
    this.updateFlattenRowKeysByExpandedRowKeys();
  }

  // 更新展开后的行数据
  private updateFlattenRowKeysByExpandedRowKeys() {
    const rowStateCenter = this.rowStateCenter;

    // 获取行的排序权重
    const _getRowSort = (rowKey: RowKey) => rowStateCenter.getStateByRowKey(rowKey)?.getMeta()._sort ?? '';

    const sortedExpandedRowKeys = this.expandedRowKeys.sort((prev, next) => rowKeyCompare(_getRowSort(prev), _getRowSort(next)))

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
