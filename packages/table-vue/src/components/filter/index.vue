<script lang="ts">
import type { FilterState, TableColumn, TableColumnFilter } from "@stable/table-typing";
import type { PropType, VNode } from "vue";
import { computed, defineComponent, h, ref } from "vue";
import { Dropdown, Button, Empty, Menu, Checkbox, Radio } from "ant-design-vue";
import { RiFilter2Fill } from "@remixicon/vue";
import { stopPropagation } from "../../utils"
import { isNil } from "lodash-es";

type VNodeOrNull = VNode | null;

export default defineComponent({
  name: "STableFilter",

  props: {
    filter: { type: Object as PropType<TableColumnFilter>, required: true },

    filterState: { type: Object as PropType<FilterState> },

    column: { type: Object as PropType<TableColumn>, required: true },
  },

  setup(props) {
    const prefixClass = "s-table-filter"

    const filterMode = computed(() => props.filter.mode ?? "menu");

    // TODO:
    const filtered = ref(false);
    const interalVisible = ref(false);
    const mergedVisible = computed(() => {
      const open = props.filter.open;
      return typeof open === 'boolean' ? open : interalVisible.value;
    });

    function renderFilterMenuItems(filter: TableColumnFilter): VNode[] {
      return filter.options!.map((option, index) => {
        const optionKey = isNil(filter.value) ? index : String(option.value);
        const label = typeof option.label === "function"
          ? option.label()
          : option.label;

        const title = option.title || (typeof label === "string" ? label : "") || ""

        if (option.children?.length) {
          return h(Menu.SubMenu, { key: optionKey, title: title }, renderFilterMenuItems({ ...filter, options: option.children }))
        }

        const Component = filter.multiple ? Checkbox : Radio;

        return h(Menu.Item, { key: optionKey }, [
          h(Component),
          h("span", {}, label as any)
        ])
      })
    }

    // TODO:
    function renderDropdownMenuContent(filter: TableColumnFilter): VNodeOrNull[] {
      const {
        options = [],
        mode = "menu"
      } = filter;

      // 渲染下拉选项
      let filterComponent: VNodeOrNull | VNodeOrNull[] = null;
      if (options.length === 0) {
        filterComponent = h(Empty)
      } else if (mode === "tree") {
        filterComponent = [];
      } else if (mode === "menu") {
        filterComponent = [
          h(
            Menu,
            {},
            {
              default: () => renderFilterMenuItems(filter)
            }
          )
        ]
      }

      return ([] as VNodeOrNull[])
        .concat(filterComponent)
        .concat([
          h("div", { class: `${prefixClass}__dropdown-btns` }, [
            h(Button, { type: "link", size: "small" }, "重置"),
            h(Button, { type: "primary", size: "small" }, "提交"),
          ])
        ]);
    }

    // 渲染下拉菜单
    function renderDropdownMenu(filter: TableColumnFilter) {
      const _onKeydown = ($event: KeyboardEvent) => {
        if ($event.code === "Enter" || $event.keyCode === 13) {
          $event.stopPropagation();
        }
      }

      const dropdownMenuContent = renderDropdownMenuContent(filter);

      return h(
        "div",
        { class: `${prefixClass}__dropdown`, onClick: stopPropagation, onKeydown: _onKeydown },
        dropdownMenuContent as any
      )
    }

    // TODO:
    function renderFilterIcon() {
      return h(RiFilter2Fill)
    }

    // 渲染 dropdown 的触发器
    function renderDropdownTrigger(option: { filtered: boolean }) {
      return h(
        'span',
        { role: "button", tabindex: -1, class: { [`${prefixClass}__trigger`]: true, [`${prefixClass}__active`]: option.filtered }, onClick: stopPropagation },
        renderFilterIcon())
    }

    // TODO: 处理下拉菜单的 visible
    function handleDropdownOpenChange(visible: boolean) {
      console.log(visible);
      interalVisible.value = visible;
    }

    // TODO:
    function getPopupContainer() {
      return document.body;
    }

    return () => {
      return h(
        Dropdown,
        {
          trigger: ["click"],
          open: mergedVisible.value,
          onOpenChange: handleDropdownOpenChange,
          // getPopupContainer: getPopupContainer,
          placement: "bottomRight"
        },
        {
          overlay: () => renderDropdownMenu(props.filter),
          default: () => {
            return renderDropdownTrigger({ filtered: filtered.value })
          },
        }
      )
    }
  }
})
</script>