<script lang="ts">
import type { RowData } from "@stable/table-typing";
import type { PropType } from "vue";
import { defineComponent, h } from "vue";
import { Input } from "ant-design-vue";
import { RiSearch2Line } from "@remixicon/vue";

export default defineComponent({
  inheritAttrs: false,

  name: "FilterSearch",

  props: {
    value: { type: String },

    filterSearch: { type: [Boolean, Function] as PropType<boolean | ((keyword: string, rowData: RowData) => boolean)> },

    onChange: { type: Function as PropType<($event: InputEvent) => void> }
  },

  setup(props) {
    const prefixClass = "s-table-filter-dropdown-search"
    return () => {
      const { value, filterSearch, onChange } = props;
      if (!filterSearch) {
        return null;
      }

      const inputVNode = h(
        Input,
        {
          onChange,
          value,
          htmlSize: 1,
          class: `${prefixClass}-input`,
          placeholder: "请输入"
        },
        {
          prefix: () => h(RiSearch2Line)
        }
      );

      return h("div", { class: prefixClass }, inputVNode);
    }
  }
});
</script>
