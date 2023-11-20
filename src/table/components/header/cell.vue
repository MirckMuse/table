<script lang="ts">
import { PropType, defineComponent, h } from "vue";
import { TableColumn } from "../../typing";

export default defineComponent({
  name: "STableHeaderCell",

  props: {
    column: { type: Object as PropType<TableColumn> }
  },

  setup(props) {
    return () => {
      const {
        column
      } = props


      return h('div', { class: "s-table-header-cell" }, column?.title);
    };
  }
})
</script>

<style lang="less" scoped>
.s-table-header-cell {
  border-top: 1px solid var(--table-border-color);
  border-bottom: transparent;
  position: relative;
  padding: var(--table-header-cell-padding);
  line-height: 1.5; // (52px - 1px(border-top) - 2 * 15px (padding)) / 14px(font-size)
  overflow-wrap: break-word;
  font-size: var(--table-header-cell-text-size);
  font-style: normal;
  font-weight: 700;

  background-color: var(--table-header-cell-bg);
  color: var(--table-header-cell-text-color);
}
</style>