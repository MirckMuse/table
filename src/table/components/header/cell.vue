<script lang="ts">
import { PropType, StyleValue, defineComponent, h, Comment, VNode } from "vue";
import { TableColumn, TableColumnEllipsisObject } from "../../typing";
import ResizeHolder from "./ResizeHolder.vue";
import { useStateInject } from "../../hooks";

export default defineComponent({
  name: "STableHeaderCell",

  props: {
    column: { type: Object as PropType<TableColumn> },

    width: { type: [String, Number] },

    ellipsis: { type: Object as PropType<TableColumnEllipsisObject> }
  },

  setup(props) {
    const prefixClass = "s-table-header-cell";

    const { slots: slotsTable } = useStateInject();

    return () => {
      const {
        column,
        ellipsis
      } = props

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

      const cellTitle = column?.title;

      const title = ellipsis?.showTitle ? cellTitle : undefined;

      const slotCell = slotsTable?.headerCell?.({ title: cellTitle, column }).filter((item: VNode) => item.type !== Comment) ?? null

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