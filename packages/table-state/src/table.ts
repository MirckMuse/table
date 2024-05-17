import type { ColKey, FilterState, GetRowKey, RowData, RowKey, SorterState, TableColumn } from "@scode/table-typing";
import { groupBy, throttle, isNil } from "lodash-es";
import { toRaw } from "vue";
import { ColMeta, TableColState } from "./col";
import { TablePagination, type ITablePagination } from "./pagination";
import { TableRowState } from "./row";
import { adjustScrollOffset, rowKeyCompare } from "./shared";
import { Viewport, type IViewport } from "./viewport";
import { Scroll } from "./scroll";
import { binaryFindIndexRange } from "@scode/table-shared";

type Noop = () => void;

export interface TableStateOption {
  rowDatas?: RowData[];

  getRowKey?: GetRowKey;

  columns?: TableColumn[];

  pagination?: ITablePagination;

  viewport?: IViewport;

  rowHeight?: number;

  col_children_name?: string;

  row_children_name?: string;
}


export type HoverState = {
  rowIndex: number;

  rowKey: RowKey;

  colKey: string;
}

const RowHeight = 55;

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
  hoverState: HoverState = {
    rowIndex: -1,
    rowKey: -1,
    colKey: ""
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

    // 初始化可视窗口
    this.viewport = new Viewport();
    Object.assign(this.viewport, option.viewport ?? {});

    this.row_children_name = option.row_children_name ?? "children";

    this.col_state = new TableColState({});
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

  // 初始化事件
  private init_event() {
    this.get_viewport_row_datas = this.row_state.is_fixed_row_height()
      ? this.get_viewport_row_datas_by_fixed_row_height
      : this.get_viewport_row_datas_by_auto_row_height;
  }

  updateColumns(columns: TableColumn[]) {
    this.col_state.update_columns(columns);

    const all_col_metas = this.col_state.get_all_meta();

    const _meta_to_col_key = (col_meta: ColMeta) => {
      return col_meta.key;
    }

    const _sort = (prev: ColMeta, next: ColMeta) => {
      if (prev.deep === next.deep) {
        return prev.sort - next.sort;
      }
      return prev.deep - next.deep;
    }

    const sorted_left_col_meta = all_col_metas.filter(meta => meta.fixed === 'left');
    this.left_col_keys = sorted_left_col_meta.sort(_sort).map(_meta_to_col_key);
    this.last_left_col_keys = sorted_left_col_meta.filter(meta => meta.is_leaf).sort((a, b) => a.sort - b.sort).map(_meta_to_col_key);

    const sorted_right_meta = all_col_metas.filter(meta => meta.fixed === 'right');
    this.right_col_keys = sorted_right_meta.sort(_sort).map(_meta_to_col_key);
    this.last_right_col_keys = sorted_right_meta.filter(meta => meta.is_leaf).sort((a, b) => a.sort - b.sort).map(_meta_to_col_key);

    const sorted_center_col_meta = all_col_metas.filter(meta => !meta.fixed).sort((a, b) => a.sort - b.sort);
    this.center_col_keys = sorted_center_col_meta.sort(_sort).map(_meta_to_col_key);
    this.last_center_col_keys = sorted_center_col_meta.filter(meta => meta.is_leaf).sort((a, b) => a.sort - b.sort).map(_meta_to_col_key);

    const col_state = this.col_state;

    const _updateSpan = (col_key: ColKey) => {
      const meta = col_state.get_meta_by_col_key(col_key);
      if (!meta) return;

      const children = col_state.get_children_meta_by_col_key(col_key);

      if (children?.length) {
        meta.col_span = children.reduce((prev, next) => {
          return (col_state.get_meta_by_column(next)?.col_span ?? 1) + prev;
        }, 0);
      }

      if (meta.is_leaf) {
        meta.row_span = col_state.get_max_deep() + 1 - (meta.deep ?? 0);
      }
    }

    this.left_col_keys.forEach(_updateSpan);
    this.right_col_keys.forEach(_updateSpan);
    this.center_col_keys.forEach(_updateSpan);
  }


  update_viewport_content_width() {
    const lastColKeys = [
      ...this.last_left_col_keys,
      ...this.last_center_col_keys,
      ...this.last_right_col_keys,
    ];

    const get_width = (col_key: ColKey) => {
      return this.col_state.get_col_width_by_col_key(col_key);
    }

    const contentWidth = lastColKeys.reduce((width, colKey) => width + get_width(colKey), 0);

    this.viewport.set_content_width(contentWidth);
  }

  add_scroll_callback(event: Noop) {
    this.scroll.add_callback(event);
  }

  remove_scroll_callback(event: Noop) {
    this.scroll.remove_callback(event);
  }

  // 更新滚动距离
  updateScroll(deltaX: number, deltaY: number) {
    const { left, top } = this.scroll;
    Object.assign(this.scroll, {
      left: left + deltaX,
      top: top + deltaY
    });

    this.adjust_scroll();
    this.scroll.run_callback();
  }

  adjust_scroll() {
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

  expandedRowKeys: RowKey[] = [];

  // 更新展开列
  // TODO: 该函数很耗时，考虑优化。
  update_expanded_row_keys(expanded_row_keys: RowKey[]) {
    const row_state = this.row_state;

    // 获取行的深度, 用作排序
    const get_row_deep = (row_key: RowKey) => row_state.get_meta_by_row_key(row_key)?.deep ?? -1;

    // 获取排序后的的 rowKey，确保子数据一定在父数据之后
    const sortedExpandedRowKeysByDeep = expanded_row_keys.sort((prev, next) => get_row_deep(prev) - get_row_deep(next));

    const expandedRowKeySet = new Set<RowKey>(sortedExpandedRowKeysByDeep);

    // 将展开的子数据生成 state 塞入 center。
    while (expandedRowKeySet.size) {
      const row_key = Array.from(expandedRowKeySet).find(row_key => row_state.get_row_data_by_row_key(row_key)); // TODO: 每次都要转换成数据，可以考虑优化

      if (!isNil(row_key)) {
        expandedRowKeySet.delete(row_key);

        const row_data = row_state.get_row_data_by_row_key(row_key);

        if (row_data) {
          const children = this.get_row_data_children(row_data) ?? [];

          if (children.length) {
            children.forEach((row, row_index) => row_state.insert_row_meta(row, row_index, row_data));
          }
        }
      }
    }

    // 最后才更新展开列
    this.expandedRowKeys = expanded_row_keys;
    console.time("update_flatten_row_keys_by_expanded_row_keys")
    this.update_flatten_row_keys_by_expanded_row_keys();
    console.timeEnd('update_flatten_row_keys_by_expanded_row_keys')
  }

  // 更新展开后的行数据
  private update_flatten_row_keys_by_expanded_row_keys() {
    const row_state = this.row_state;

    // // 获取行的排序权重
    const _get_row_sort = (row_key: RowKey) => row_state.get_meta_by_row_key(row_key)?.sort ?? '';

    console.time("sortedExpandedRowKeys");
    const sortedExpandedRowKeys = this.expandedRowKeys.sort((prev, next) => rowKeyCompare(_get_row_sort(prev), _get_row_sort(next)))
    console.timeEnd("sortedExpandedRowKeys");

    const newflattenRowKeys: RowKey[] = [];
    let children: RowData[] = [];
    let _rawRowIndex = 0;
    let _expandRowIndedx = 0;

    console.time("get_raw_row_keys");
    const rawRowKeys = row_state.get_raw_row_keys();
    console.timeEnd("get_raw_row_keys");

    console.time('while')
    while (_rawRowIndex < rawRowKeys.length || children.length) {
      const childrenTop = children.shift();

      const row_key = childrenTop
        ? this.row_state.get_meta_by_row_data(childrenTop)?.key
        : rawRowKeys[_rawRowIndex];

      if (!childrenTop) {
        _rawRowIndex++;
      }

      if (row_key === sortedExpandedRowKeys[_expandRowIndedx]) {
        _expandRowIndedx++;

        const row_data = row_state.get_row_data_by_row_key(row_key);
        if (row_data) {
          children = [
            ...(this.get_row_data_children(row_data) ?? []),
            ...children
          ];
        }

      }
      if (row_key) {
        newflattenRowKeys.push(row_key)
      }
    }
    console.timeEnd('while')

    this.flatten_row_keys = newflattenRowKeys;

    console.time('update_flatten')
    // 主要耗时
    this.update_flatten(newflattenRowKeys);
    console.timeEnd('update_flatten')

    console.time('reset_flatten_row_y')
    this.reset_flatten_row_y();
    console.timeEnd('reset_flatten_row_y')
  }

  // =============== TODO: 重构 =============================
  viewport: Viewport;

  scroll = new Scroll();

  pagination?: TablePagination;

  col_state: TableColState;

  // 左侧
  left_col_keys: ColKey[] = [];
  last_left_col_keys: ColKey[] = [];

  // 中间
  center_col_keys: ColKey[] = [];
  last_center_col_keys: ColKey[] = [];

  // 右侧
  right_col_keys: ColKey[] = [];
  last_right_col_keys: ColKey[] = [];

  row_state: TableRowState;

  col_children_name = "children";
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
  pre_col: PreCol | null = null;

  // 最后扁平后的数据
  flatten_row_keys: RowKey[] = [];
  flatten_row_heights: number[] = [];
  flatten_row_y: number[] = [];
  flatten_row_key_map_index = new Map();

  private reset_flatten_row_y() {
    let y = 0;
    const flatten_row_y = [];
    for (const height of this.flatten_row_heights) {
      flatten_row_y.push(y);
      y += height;
    }

    this.flatten_row_y = flatten_row_y;
    this.viewport.set_content_height(y);
  }
  private throttle_reset_flatten_row_y = throttle(this.reset_flatten_row_y, 16);

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

  private update_flatten(flatten_row_keys: RowKey[]) {
    const row_state = this.row_state;

    const map = new Map();
    const flatten_row_heights = [];
    for (let index = 0; index < flatten_row_keys.length; index++) {
      const row_key = flatten_row_keys[index];
      map.set(row_key, index);
      flatten_row_heights[index] = row_state.get_row_height_by_row_key(row_key);
    }

    this.flatten_row_key_map_index = map;
    this.flatten_row_heights = flatten_row_heights;
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
      this.update_flatten(this.flatten_row_keys);
      this.reset_flatten_row_y();
    }

    this.row_state.update_row_datas(row_datas, done_callback);
    this.flatten_row_keys = ([] as RowKey[]).concat(this.row_state.get_raw_row_keys());
    this.update_flatten(this.flatten_row_keys);
    this.reset_flatten_row_y();

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

    const row_keys = Object.keys(grouped_cell_metas);

    let is_row_height_change = false;

    for (const row_key of row_keys) {
      const row_meta = this.row_state.get_meta_by_row_key(row_key);
      if (row_meta) {
        const outer_row_metas = grouped_cell_metas[row_key];
        const row_height = Math.max(...outer_row_metas.map(meta => meta.height));
        const current_row_offset_height = row_height - (row_meta.height ?? 0);
        offset_height = offset_height + current_row_offset_height;

        is_row_height_change = is_row_height_change || current_row_offset_height > 0;

        const current_row_index = this.flatten_row_key_map_index.get(row_key);
        this.flatten_row_heights[current_row_index] = row_height;
        this.row_state.update_row_height_by_row_key(row_key, row_height);
      }
    }

    if (offset_height !== 0) {
      this.viewport.set_content_height(this.viewport.get_content_height() + offset_height);
    };

    if (is_row_height_change) {
      this.throttle_reset_flatten_row_y();
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
    to = Math.min(to + buffer, flatten_row_keys.length - 1);
    this.pre_row = {
      top: scroll_top,
      from,
      to,
      from_y: from * fixed_row_height
    }

    return this.get_row_datas_by_pre_row(this.pre_row!, flatten_row_keys);
  }

  private get_pre_row_to(from: number, flatten_row_keys: RowKey[]): number {
    let viewport_height = this.viewport.get_height();

    let to = from;

    for (let i = from + 1; i < flatten_row_keys.length; i++) {
      if (viewport_height <= 0) {
        break;
      }

      const row_key = flatten_row_keys[i];
      const height = this.row_state.get_row_height_by_row_key(row_key);
      viewport_height -= height;
      to++;
    }

    return to;
  }

  private get_viewport_row_datas_by_auto_row_height(): RowData[] {
    const _createCompare = (targetY: number) => {
      return (y: number) => {
        return targetY - y;
      }
    }

    const flatten_row_keys = this.flatten_row_keys;
    const flatten_row_y = this.flatten_row_y;
    const from = binaryFindIndexRange(flatten_row_y, _createCompare(this.scroll.top));
    let to = from;
    const target = this.viewport.get_height() + this.scroll.top;
    for (; to < flatten_row_keys.length; to++) {
      if (target < flatten_row_y[to]) {
        break
      }
    }
    this.pre_row = { top: 0, from, to, from_y: 0 };
    adjustPreRow(this.pre_row, flatten_row_keys, this.row_state);
    this.pre_row.from_y = flatten_row_y[this.pre_row.from];
    return this.get_row_datas_by_pre_row(this.pre_row!, flatten_row_keys);
  }
}

function adjustPreRow(pre_row: PreRow, flatten_row_keys: RowKey[], row_state: TableRowState) {
  pre_row.from = Math.min(pre_row.from, pre_row.to, flatten_row_keys.length - 1);
  pre_row.from = Math.max(0, pre_row.from);
  pre_row.to = Math.max(pre_row.from, pre_row.to);
  pre_row.top = Math.max(pre_row.top, 0);

  let { from, to } = pre_row;
  let buffer = Math.ceil((to - from) / 2);
  let new_from = Math.max(0, from - buffer);
  // TODO: 需要校准 from_y

  pre_row.from = new_from;
  pre_row.to = Math.min(to + buffer, flatten_row_keys.length - 1);

  const beforeAdjustFrom = pre_row.from;

  for (let i = pre_row.from; i < beforeAdjustFrom; i++) {
    const row_key = flatten_row_keys[i];
    const height = row_state.get_meta_by_row_key(row_key)?.height ?? 0;
    pre_row.from_y -= height;
  }
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

