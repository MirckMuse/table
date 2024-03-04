<script lang="ts">
import type { PropType, StyleValue, VNode } from "vue";
import type { SorterState, TableColumn, TableColumnEllipsisObject } from "@stable/table-typing";
import { SorterDirection } from "@stable/table-typing";
import { defineComponent, h, Comment } from "vue";
import { useStateInject } from "../../hooks";
import { toArray } from "../../utils";
import ResizeHolder from "./ResizeHolder.vue";
import { SorterFill } from "../icon"

// 渲染 sorter 样式
function renderSorter(column: TableColumn, sorterState?: SorterState) {
  if (!column?.sorter) return null;

  const direction = sorterState?.direction;

  return h(
    'span',
    { class: "s-table-header-cell__sorter" },
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

    const { slots: slotsTable } = useStateInject();

    // 渲染用户配置的 title
    function renderColumnTitle(column?: TableColumn) {
      return typeof column?.title === "function"
        ? column?.title()
        : column?.title;
    }

    function renderHeaderCellContent(column?: TableColumn): any {
      const title = renderColumnTitle(column);

      if (column?.sorter) {
        const sorterVNode = renderSorter(column, { direction: SorterDirection.Ascend });

        const cellExtends = h('div', {}, [
          sorterVNode
        ]);

        return h(
          "div",
          {
            class: `${prefixClass}__content`,
          },
          [title as any, cellExtends]
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