import type { ColKey, FilterState, GetRowKey, RowData, RowKey, SorterState, TableColumn } from "@scode/table-typing";
import { groupBy } from "lodash-es";
import { toRaw } from "vue";
import { TableColStateCenter } from "./col";
import { TablePagination, type ITablePagination } from "./pagination";
import { TableRowState } from "./row";
import { adjustScrollOffset } from "./shared";
import { Viewport, type IViewport } from "./viewport";

export interface TableStateOption {
  rowDatas?: RowData[];

  getRowKey?: GetRowKey;

  columns?: TableColumn[];

  pagination?: ITablePagination;

  viewport?: IViewport;

  rowHeight?: number;

  childrenColumnName?: string;

  row_children_name?: string;
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

// 获取最大滚动距离。
function get_max_scroll(viewport: Viewport): [number, number] {
  const maxXMove = Math.max(0, viewport.get_content_width() - viewport.get_width());
  const maxYMove = Math.max(0, viewport.get_content_height() - viewport.get_height());
  return [maxXMove, maxYMove];
}

// 表格的状态类
export class TableState {
  colStateCenter: TableColStateCenter;

  hoverState: HoverState = {
    rowIndex: -1,
    rowKey: -1,
    colKey: ""
  }

  childrenColumnName = "children";

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

    // 初始化可视窗口
    this.viewport = new Viewport();
    Object.assign(this.viewport, option.viewport ?? {});

    this.childrenColumnName = option.childrenColumnName ?? "children";
    this.row_children_name = option.row_children_name ?? "children";

    this.colStateCenter = new TableColStateCenter({ tableState: this });

    this.row_state = new TableRowState({
      row_height: option.rowHeight ?? RowHeight,
      is_fixed_row_height: !!option.rowHeight,
      get_row_key: option.getRowKey
    });
  }

  private init(option: TableStateOption) {
    this.init_event();


    if (option.columns?.length) {
      this.updateColumns(option.columns);
    }

    if (option.rowDatas?.length) {
      this.update_row_datas(option.rowDatas)
    }
  }

  // 获取可视窗口的行数据
  getViewportDataSource: () => RowData[];


  // 初始化事件
  private init_event() {
    this.get_viewport_row_datas = this.row_state.is_fixed_row_height()
      ? this.get_viewport_row_datas_by_fixed_row_height
      : this.get_viewport_row_datas_by_auto_row_height;
  }

  updateColumns(columns: TableColumn[]) {
    this.colStateCenter.updateColumns(columns);
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
    // this.rowStateCenter.updateFilterStates(filterStates);

    // if (this.scrollToTopAfterFilterOrSorter) {
    //   this.scroll.top = 0;
    // }

    // // 筛选后需要更新可滚动距离
    // const { flattenYIndexes } = this.rowStateCenter;
    // const lastRowY = flattenYIndexes[flattenYIndexes.length - 1] ?? 0;
    // this.viewport.scrollHeight = lastRowY;
  }

  updateSorterStates(sorterStates: SorterState[]) {
    // this.rowStateCenter.updateSorterStates(sorterStates);
    // if (this.scrollToTopAfterFilterOrSorter) {
    //   this.scroll.top = 0;
    // }
  }

  getRowDataChildren(rowData: RowData): RowData[] | undefined {
    return rowData[this.childrenColumnName] as RowData[]
  }

  expandedRowKeys: RowKey[] = [];

  // 更新展开列
  updateExpandedRowKeys(expandedRowKeys: RowKey[]) {
    // const rowStateCenter = this.rowStateCenter;

    // // 获取行的深度, 用作排序
    // const getRowDeep = (rowKey: RowKey) => rowStateCenter.getStateByRowKey(rowKey)?.getMeta()?.deep ?? -1;

    // // 获取排序后的的 rowKey，确保子数据一定在父数据之后
    // const sortedExpandedRowKeysByDeep = expandedRowKeys.sort((prev, next) => getRowDeep(prev) - getRowDeep(next));

    // const expandedRowKeySet = new Set<RowKey>(sortedExpandedRowKeysByDeep);

    // // 将展开的子数据生成 state 塞入 center。
    // while (expandedRowKeySet.size) {
    //   const rowKey = Array.from(expandedRowKeySet).find(key => rowStateCenter.getRowDataByRowKey(key));

    //   if (!isNil(rowKey)) {
    //     expandedRowKeySet.delete(rowKey);

    //     const rowData = rowStateCenter.getRowDataByRowKey(rowKey);

    //     if (rowData) {
    //       const parentMeta = rowStateCenter.getStateByRowKey(rowKey)?.getMeta();
    //       const children = this.getRowDataChildren(rowData) ?? [];

    //       if (children.length) {

    //         children.forEach((row, rowIndex) => {
    //           rowStateCenter.insertRowState(row, {
    //             index: rowIndex,
    //             deep: parentMeta ? (parentMeta.deep + 1) : 0,
    //             _sort: `${parentMeta ? parentMeta._sort : "0"}-${String(rowIndex)}`
    //           });
    //         });
    //       }
    //     }
    //   }
    // }

    // // 最后才更新展开列
    // this.expandedRowKeys = expandedRowKeys;
    // this.updateFlattenRowKeysByExpandedRowKeys();
  }

  // 更新展开后的行数据
  private updateFlattenRowKeysByExpandedRowKeys() {
    // const rowStateCenter = this.rowStateCenter;

    // // 获取行的排序权重
    // const _getRowSort = (rowKey: RowKey) => rowStateCenter.getStateByRowKey(rowKey)?.getMeta()._sort ?? '';

    // const sortedExpandedRowKeys = this.expandedRowKeys.sort((prev, next) => rowKeyCompare(_getRowSort(prev), _getRowSort(next)))

    // const newflattenRowKeys: RowKey[] = [];
    // let children: RowData[] = [];
    // let _rawRowIndex = 0;
    // let _expandRowIndedx = 0;
    // while (_rawRowIndex < rowStateCenter.rawRowKeys.length || children.length) {
    //   const childrenTop = children.shift();
    //   const rowKey = childrenTop
    //     ? rowStateCenter.getStateByRowData(childrenTop)?.getMeta().key
    //     : rowStateCenter.rawRowKeys[_rawRowIndex];
    //   if (!childrenTop) {
    //     _rawRowIndex++;
    //   }

    //   if (rowKey === sortedExpandedRowKeys[_expandRowIndedx]) {
    //     _expandRowIndedx++;

    //     const rowData = rowStateCenter.getRowDataByRowKey(rowKey);
    //     if (rowData) {
    //       children = (this.getRowDataChildren(rowData) ?? []).concat(children);
    //     }

    //   }
    //   rowKey && newflattenRowKeys.push(rowKey);
    // }

    // this.rowStateCenter.flattenRowKeys = newflattenRowKeys;
  }

  // =============== TODO: 重构 =============================
  viewport: Viewport;

  scroll: Scroll = { left: 0, top: 0 };

  pagination?: TablePagination;

  row_state: TableRowState;

  row_children_name = "children";

  get_row_data_children(row_data: RowData): RowData[] | null {
    const children = row_data[this.row_children_name];
    if (Array.isArray(children)) {
      return children as RowData[];
    }

    return null;
  }


  // 上一次根据纵向滚动状态计算出来的 scrollTop, from, y
  private pre_row: PreRow | null = null;

  // TODO:
  filter_states: FilterState[] = [];

  sorter_states: SorterState[] = [];

  get_viewport_offset_top() {
    return this.pre_row?.from_y ?? 0;
  }

  // TODO: 上一次根据
  private pre_col: PreCol | null = null;


  // 最后扁平后的数据
  flatten_row_keys: RowKey[] = [];

  is_empty() {
    return !this.flatten_row_keys.length;
  }

  // 获取当前分页的行 key
  get_current_page_row_keys() {
    if (!this.pagination) {
      return this.flatten_row_keys;
    }

    const { size, page } = this.pagination;
    return this.flatten_row_keys.slice((page - 1) * size, page * size);
  }

  update_viewport(width: number, height: number) {
    this.viewport.set_width(width)
    this.viewport.set_height(height)
  }

  // 更新行数据
  update_row_datas(row_datas: RowData[]) {
    // FIXME: 分页情况下可能有问题，主要发生问题的地方是不定高度。
    const _row_datas = row_datas;
    this.viewport.set_content_height(_row_datas.length * this.row_state.get_row_height());

    const done_callback = () => {
      const raw_row_keys = toRaw(this.row_state.get_raw_row_keys());

      if (!this.row_state.is_fixed_row_height()) {
        const row_state = this.row_state;
        const content_height = raw_row_keys.reduce<number>((content_height, row_key) => {
          return content_height + (row_state.get_meta_by_row_key(row_key)?.height ?? 0);
        }, 0);

        this.viewport.set_content_height(content_height);
      }

      this.flatten_row_keys = ([] as RowKey[]).concat(raw_row_keys);
    }
    this.row_state.update_row_datas(row_datas, done_callback);

    setTimeout(() => {
      // TODO: 筛选和排序字段需要赋值;
    })
  }

  // 更新行的原数据
  update_row_metas(row_metas: OuterRowMeta[]) {
    // 固定行高，无需更新行 meta。
    if (this.row_state.is_fixed_row_height()) return;

    const grouped_cell_metas = groupBy(row_metas, "rowKey");

    let offset_height = 0;
    let offset_from_y = 0;

    const row_keys = Object.keys(grouped_cell_metas);
    const is_fixed_row_height = this.row_state.is_fixed_row_height();

    for (const row_key of row_keys) {
      const row_meta = this.row_state.get_meta_by_row_key(row_key);
      if (row_meta) {
        const outer_row_metas = grouped_cell_metas[row_key];
        const row_height = Math.max(...outer_row_metas.map(meta => meta.height));
        const current_row_offset_height = row_height - (row_meta.height ?? 0);
        offset_height = offset_height + current_row_offset_height;
        if (!is_fixed_row_height) {
          offset_from_y = offset_from_y + current_row_offset_height;
        }
        this.row_state.update_row_height_by_row_key(row_key, row_height);
      }
    }

    if (offset_height !== 0) {
      this.viewport.set_content_height(this.viewport.get_content_height() + offset_height);
    };

    if (offset_from_y !== 0 && this.pre_row) {
      this.pre_row.from_y = this.pre_row.from_y + offset_from_y;
    }
  }

  // 根据数据获取行高列表
  get_row_heights_by_row_datas(row_datas: RowData[]): number[] {
    return row_datas.map(row_data => this.row_state.get_meta_by_row_data(row_data)?.height ?? 0)
  }

  get_viewport_row_datas: () => RowData[];

  private get_row_datas_by_pre_row(pre_row: PreRow, flatten_row_keys: RowKey[]) {
    const { from, to } = pre_row;

    return Array(to - from + 1).fill(null).reduce((result, _, index) => {
      const row_index = from + index;
      const rowData = this.row_state.get_row_data_by_row_key(flatten_row_keys[row_index]);
      if (rowData) {
        result.push(rowData);
      }
      return result;
    }, []);
  }

  private get_viewport_row_datas_by_fixed_row_height(): RowData[] {
    const flatten_row_keys = this.flatten_row_keys;
    const fixed_row_height = this.row_state.get_row_height();
    const scroll_top = this.scroll.top;

    let from = Math.floor(scroll_top / fixed_row_height);
    let to = Math.ceil(this.viewport.get_height() / fixed_row_height) + from;
    const buffer = Math.floor((to - from) / 2);
    from = Math.max(from - buffer, 0);
    to = Math.max(to + buffer, flatten_row_keys.length - 1);
    this.pre_row = {
      top: scroll_top,
      from,
      to,
      from_y: from * fixed_row_height
    }
    return this.get_row_datas_by_pre_row(this.pre_row!, flatten_row_keys);
  }

  private get_viewport_row_datas_by_auto_row_height(): RowData[] {
    const flatten_row_keys = this.flatten_row_keys;

    if (this.pre_row) {
      const pre_scroll_top = this.pre_row?.top ?? 0;
      const new_scroll_top = this.scroll.top ?? 0;
      let scroll_offset = new_scroll_top - pre_scroll_top;
      // 方向
      const direction = scroll_offset > 0 ? 1 : -1;
      scroll_offset = Math.abs(scroll_offset);
      let index_offset = 0;
      let y_offset = 0;

      while (0 <= this.pre_row.to + index_offset && this.pre_row.to + index_offset < flatten_row_keys.length) {
        const row_key = flatten_row_keys[this.pre_row.to + index_offset];
        const height = this.row_state.get_meta_by_row_key(row_key)?.height ?? 0;
        scroll_offset -= height;

        if (scroll_offset < 0) {
          break;
        }
        index_offset += direction;
        y_offset += (direction * height);
      }

      this.pre_row.from = this.pre_row.from + index_offset;
      this.pre_row.from_y = this.pre_row.from_y + y_offset;
      // FIXME: 需要考虑 from 和 to 不同步问题。
      this.pre_row.to = this.pre_row.to + index_offset;
      adjustPreRow(this.pre_row, flatten_row_keys, this.row_state);
      return this.get_row_datas_by_pre_row(this.pre_row!, flatten_row_keys);
    }

    // 首次获取
    this.pre_row = { top: 0, from: 0, to: 0, from_y: 0 };
    let viewport_height = this.viewport.get_height();
    let to_index = 0;

    while (1) {
      const row_key = flatten_row_keys[to_index];
      const height = this.row_state.get_meta_by_row_key(row_key)?.height ?? 0;
      viewport_height -= height;

      if (viewport_height < 0) {
        break;
      }
      to_index += 1;
    }

    this.pre_row.to = to_index;
    adjustPreRow(this.pre_row, flatten_row_keys, this.row_state);
    return this.get_row_datas_by_pre_row(this.pre_row!, flatten_row_keys);
  }
}

function adjustPreRow(pre_row: PreRow, flatten_row_keys: RowKey[], row_state: TableRowState) {
  pre_row.from = Math.min(pre_row.from, pre_row.to);
  pre_row.from = Math.max(0, pre_row.from);
  pre_row.to = Math.max(pre_row.from, pre_row.to);
  pre_row.top = Math.max(pre_row.top, 0);

  let { from, to } = pre_row;
  let buffer = Math.ceil((to - from) / 2);
  let new_from = Math.max(0, from - buffer);
  // TODO: 需要校准 from_y

  const direction = new_from - from > 0 ? 1 : -1;

  for (let i = from; i < direction * new_from; i += direction) {
    const row_key = flatten_row_keys[i];
    pre_row.from_y += direction * row_state.get_row_height_by_row_key(row_key)
  }

  pre_row.from = new_from;
  pre_row.to = Math.min(to + buffer, flatten_row_keys.length - 1);
  pre_row.from_y = Math.max(pre_row.from_y, 0);
}

// TODO: 因为分页，可以考虑添加一个 max_from 和 max_to。
export type PreRow = {
  top: number,
  from: number,
  max_from?: number,
  to: number,
  from_y: number,
  max_to?: number,
}

export type PreCol = {
  left: number,
  from: ColKey,
  to: ColKey,
  from_x: number,
}
