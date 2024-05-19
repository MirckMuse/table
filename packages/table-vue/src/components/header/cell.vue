<script lang="ts">
import type { SorterState, TableColumn, TableColumnEllipsisObject, TableColumnFilterValue } from "@scode/table-typing";
import type { PropType, StyleValue, VNode } from "vue";

import { SorterDirection } from "@scode/table-typing";
import { Comment, computed, defineComponent, h } from "vue";
import { useStateInject } from "../../hooks";
import { toArray } from "../../utils";
import HeaderFilter from "../filter/index.vue";
import { SorterFill } from "../icon";
import ResizeHolder from "./ResizeHolder.vue";

// 渲染 sorter 样式
// TODO: 可以从外部传入
function renderSorter(
  column: TableColumn,
  processSorter: () => void,
  sorterState?: SorterState,
) {
  if (!column?.sorter) return null;

  const direction = sorterState?.direction;

  return h(
    'span',
    { class: "s-table-header-cell__sorter", onClick: processSorter },
    h(SorterFill, { class: { "s-icon": true, [`s-icon__${direction}`]: true } })
  );
}

export default defineComponent({
  name: "STableHeaderCell",

  props: {
    column: { type: Object as PropType<TableColumn>, required: true },

    width: { type: [String, Number] },

    ellipsis: { type: [Object, Boolean] as PropType<TableColumnEllipsisObject> }
  },

  setup(props) {
    const prefixClass = "s-table-header-cell";

    const { slots: slotsTable, tableState, callback } = useStateInject();

    const computedColKey = computed(() => tableState.value.col_state.get_meta_by_column(props.column)?.key);

    const computedFilterState = computed(() => tableState.value.filter_states.find(state => state.colKey === computedColKey.value))

    // 渲染用户配置的 title
    function renderColumnTitle(column?: TableColumn) {
      return typeof column?.title === "function"
        ? column?.title()
        : column?.title;
    }


    // 执行搜索
    function processFilter(filterKeys: TableColumnFilterValue[]) {
      const colKey = computedColKey.value;
      if (!colKey) return;

      let filterStates = tableState.value.filter_states;


      if (!filterKeys.length) {
        tableState.value.updateFilterStates(filterStates.filter(state => state.colKey !== colKey))
        return;
      }

      const matchedFilter = filterStates.find(state => state.colKey === colKey);

      if (matchedFilter) {
        matchedFilter.filterKeys = filterKeys;
      } else {
        filterStates.push({ colKey, filterKeys });
      }

      tableState.value.updateFilterStates(filterStates);
    }

    // 当前列的排序状态
    const sorterState = computed(() => {
      const { column } = props;

      if (!column?.sorter) return;

      return tableState.value.sorter_states.find(state => state.col_key === computedColKey.value);
    })

    // 执行排序
    function processSorter() {
      const colKey = computedColKey.value;
      if (!colKey) return;

      let sorterStates = tableState.value.sorter_states;

      if (!sorterState.value) {
        // 无状态 -> 升序
        sorterStates.push({ col_key: colKey, direction: SorterDirection.Ascend });
      } else if (sorterState.value.direction === SorterDirection.Ascend) {
        // 升序 -> 降序
        const matchedState = sorterStates.find(state => state.col_key === colKey);
        if (matchedState) {
          matchedState.direction = SorterDirection.Descend;
        }
      } else if (sorterState.value.direction === SorterDirection.Descend) {
        // 降序 -> 无状态
        sorterStates = sorterStates.filter(state => state.col_key !== colKey);
      }

      console.time('update_sorter_states')
      tableState.value.update_sorter_states(sorterStates);
      console.timeEnd('update_sorter_states')

      callback['updateViewportDataSource']?.();
    }

    // 渲染排序的图标
    function renderHeaderCellContent(column?: TableColumn): any {
      const title = renderColumnTitle(column);

      const appendVNodes: VNode[] = [];

      if (column?.sorter) {
        const _vNode = renderSorter(column, processSorter, sorterState.value);
        _vNode && appendVNodes.push(_vNode);
      }

      if (column?.filter) {
        appendVNodes.push(h(HeaderFilter, {
          filter: column.filter,
          filterState: computedFilterState.value,
          column: column,
          triggerFilter: processFilter,
          // TODO: 缺少一个筛选自定义渲染函数
        }))
      }

      if (appendVNodes.length) {
        return h(
          "div",
          {
            class: `${prefixClass}__content`,
          },
          [title as any, h('div', { class: prefixClass + "__append" }, appendVNodes)]
        )
      }

      return title;
    }

    return () => {
      const { column, ellipsis } = props;

      const cellClass = {
        [prefixClass]: true,
      }

      const cellInnerClass = {
        [`${prefixClass}-inner`]: true,
        [`${prefixClass}-inner-ellipsis`]: !!ellipsis
      }

      const cellInnerStyle: StyleValue = {
        textAlign: column?.align
      }

      const cellTitle = renderHeaderCellContent(column);

      const title = ellipsis?.showTitle ? cellTitle : undefined;

      const headerCellVNodes = toArray(slotsTable?.headerCell?.({ title: cellTitle, column: column! })) as VNode[];

      const slotCell = headerCellVNodes.filter((item: VNode) => item && item?.type !== Comment) ?? null

      const inner = h("div", { class: cellInnerClass, style: cellInnerStyle }, slotCell?.length ? slotCell : cellTitle)

      const cellBind = column?.customHeaderCell?.(column) ?? {};

      const resizeHolder = column?.resizable ? h(ResizeHolder, { column: column }) : null;

      return h('div', { class: cellClass, title, ...cellBind }, [inner, resizeHolder]);
    };
  }
})
</script>

<style lang="less" scoped>
.s-table-header-cell {
  border-bottom: 1px solid var(--table-border-color);
  position: relative;
  padding: var(--table-header-cell-padding);
  line-height: 1.5; // (52px - 1px(border-top) - 2 * 15px (padding)) / 14px(font-size)
  overflow-wrap: break-word;
  font-size: var(--table-header-cell-text-size);
  font-style: normal;
  font-weight: 700;

  background-color: var(--table-header-cell-bg);
  color: var(--table-header-cell-text-color);

  display: inline-flex;
  min-width: 0;
  align-items: center;
  overflow: visible;

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__sorter {
    display: flex;
    flex-direction: column;
  }

  &-inner {
    flex: 1;

    &-ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
  }
}
</style>

<style lang="less">
svg.s-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;

  &.s-icon__ascend path#ascend {
    color: var(--table-header-cell-sorter-color-active);
  }

  &.s-icon__descend path#descend {
    fill: var(--table-header-cell-sorter-color-active);
  }
}
</style>