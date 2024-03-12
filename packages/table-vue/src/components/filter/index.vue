<script lang="ts">
import type { FilterState, TableColumn, TableColumnFilter, TableColumnFilterValue } from "@stable/table-typing";
import type { PropType, VNode } from "vue";
import { computed, defineComponent, h, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Dropdown, Button, Empty, Menu, Checkbox, Radio } from "ant-design-vue";
import { RiFilter2Fill } from "@remixicon/vue";
import { stopPropagation } from "../../utils"
import { isEqual, isNil } from "lodash-es";
import { flattenKeys } from "@stable/table-shared";
import FilterSearch from "./Search.vue";

type VNodeOrNull = VNode | null;

interface FilterResetProps {
  confirm?: boolean;

  closeDropdown?: boolean;
}

const DefaultFilterResetProps: FilterResetProps = {
  confirm: false,
  closeDropdown: false,
}

const DefaultTableColumnFilter: TableColumnFilter = { mode: "menu", multiple: true }

export default defineComponent({
  name: "STableFilter",

  props: {
    filter: { type: Object as PropType<TableColumnFilter>, required: true },

    filterState: { type: Object as PropType<FilterState> },

    column: { type: Object as PropType<TableColumn>, required: true },

    triggerFilter: { type: Function as PropType<(filterState: FilterState) => void> },

    customRenderFilterDropdown: { type: Function }
  },

  setup(props) {
    const prefixClass = "s-table-filter"

    const keywords = shallowRef("");
    function handleSearch($event: any) {
      keywords.value = $event.target?.value ?? "";
    }

    const mergedFilter = computed(() => {
      return Object.assign<TableColumnFilter, TableColumnFilter>(DefaultTableColumnFilter, props.filter);
    });

    const interalVisible = ref(false);
    watch(interalVisible, (_visible) => {
      if (_visible) return;

      keywords.value = "";
    });

    const mergedVisible = computed(() => {
      const open = props.filter.open;
      return typeof open === 'boolean' ? open : interalVisible.value;
    });

    // 筛选后的值
    const filteredKeys = computed(() => props.filterState?.filterKeys);

    watch(filteredKeys, (_selectedKeys) => {
      if (!mergedVisible.value) return;

      handleSelectKeys({ selectedKeys: _selectedKeys })
    }, { immediate: true });

    const flattenFilteredKeys = computed(() => flattenKeys<TableColumnFilterValue>(mergedFilter.value.options));

    const onFilterDropdownOpenChange = computed(() => props.filter.onOpenChange)

    // TODO:
    const filtered = ref(false);

    const selectedKeys = shallowRef<TableColumnFilterValue[]>();

    const openKeys = shallowRef<TableColumnFilterValue[]>();
    let openTimer: NodeJS.Timeout | null = null;

    function clearOpenTimer() {
      openTimer && clearTimeout(openTimer);
    }

    function handleOpenKeysChange(keys: TableColumnFilterValue[]) {
      openTimer = setTimeout(() => openKeys.value = keys)
    }

    function handleMenuClick() {
      clearOpenTimer();
    }

    onBeforeUnmount(clearOpenTimer)

    // 触发 dropdown open 的逻辑。
    function triggerVisible(visible: boolean) {
      interalVisible.value = visible;
      onFilterDropdownOpenChange.value?.(visible);
    }

    // 触发确认逻辑
    function triggerConfirm(keys?: TableColumnFilterValue[]) {
      const { filterState, triggerFilter, column } = props;
      const _keys = keys?.length ? keys : null;
      if (_keys === null && !filterState?.filterKeys) {
        return null;
      }

      if (isEqual(_keys, filterState?.filterKeys)) {
        return null;
      }

      triggerFilter?.({
        colKey: column.key ?? "",
        ...(filterState || {}),
        filterKeys: _keys ?? []
      })
    }

    // 渲染表单项
    function renderFilterMenuItems(filter: TableColumnFilter): VNode[] {
      return filter.options!.map((option, index) => {
        const optionKey = isNil(filter.value) ? index : String(option.value);
        const label = typeof option.label === "function"
          ? option.label()
          : option.label;

        const title = option.title || (typeof label === "string" ? label : "") || ""

        if (option.children?.length) {
          return h(Menu.SubMenu, {
            key: optionKey,
            title: title,
            popupClassName: `${prefixClass}__dropdown-submenu`
          }, () => renderFilterMenuItems({ ...filter, options: option.children }))
        }

        const Component = filter.multiple ? Checkbox : Radio;

        return h(Menu.Item, { key: optionKey }, () => [
          h(Component),
          h("span", {}, label as any)
        ])
      })
    }

    // 处理 reset
    function handleReset(option?: FilterResetProps) {
      const mergedOption = Object.assign({}, DefaultFilterResetProps, option);

      if (mergedOption.confirm) {
        triggerConfirm([]);
      }
      if (mergedOption.closeDropdown) {
        triggerVisible(false);
      }
      keywords.value = "";

      // 重置默认的筛选值
      const { resetToDefaultFilteredValue, defaultFilteredValue } = props.filter;
      if (resetToDefaultFilteredValue) {
        selectedKeys.value = (defaultFilteredValue || []).map(value => String(value));
      } else {
        selectedKeys.value = [];
      }
    }

    // 处理菜单项的confirm
    function handleConfirm() {
      triggerVisible(false);
      triggerConfirm(selectedKeys.value);
    }

    function handleCustomConfirm({ closeDropdown } = { closeDropdown: true }) {
      if (closeDropdown) {
        triggerVisible(false)
      }

      triggerConfirm(selectedKeys.value);
    }

    // 重置按钮的禁用逻辑
    const resetDisabled = computed(() => {
      const _selectedKeys = selectedKeys.value;

      const { resetToDefaultFilteredValue, defaultFilteredValue } = props.filter;

      if (resetToDefaultFilteredValue) {
        return isEqual(
          (defaultFilteredValue || []).map(value => String(value)),
          _selectedKeys,
        )
      }

      return !_selectedKeys?.length;
    });

    // TODO: 渲染下拉菜单的内容
    function renderDropdownMenuContent(filter: TableColumnFilter): VNodeOrNull[] {
      const {
        options = [],
        multiple,
        mode = "menu"
      } = filter;

      // 渲染下拉选项
      let filterComponent: VNodeOrNull | VNodeOrNull[] = null;
      if (options.length === 0) {
        filterComponent = h(Empty)
      } else if (mode === "tree") {
        filterComponent = [];
      } else if (mode === "menu") {
        const _valueMap = (value: unknown) => String(value);
        filterComponent = [
          h(FilterSearch, {
            filterSearch: () => true,
            value: keywords.value,
            onChange: handleSearch
          }),
          h(
            Menu,
            {
              multiple,
              // prefixCls: `${prefixClass}__dropdown-menu`,
              selectedKeys: (selectedKeys.value ?? []).map(_valueMap),
              openKeys: (openKeys.value ?? []).map(_valueMap),
              onClick: handleMenuClick,
              onSelect: handleSelectKeys,
              onDeselect: handleSelectKeys,
              getPopupContainer: getPopupContainer,
              onOpenChange: handleOpenKeysChange
            },
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
            h(Button, { type: "link", size: "small", disabled: resetDisabled.value, onClick: () => handleReset() }, () => "重置"),
            h(Button, { type: "primary", size: "small", onClick: handleConfirm }, () => "提交"),
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
      const dropdownMenuContent = props.customRenderFilterDropdown
        ? props.customRenderFilterDropdown({
          visible: mergedVisible.value,
          column: props.column,
          options: filter.options,
          setSelectedKeys: (keys: TableColumnFilterValue[]) => handleSelectKeys({ selectedKeys: keys }),
          selectedKeys: selectedKeys.value,
          onConfirm: handleCustomConfirm,
          onReset: handleReset,
          onClose: () => triggerVisible(false)
        })
        : renderDropdownMenuContent(filter);

      return h(
        "div",
        { class: `${prefixClass}__dropdown`, onClick: stopPropagation, onKeydown: _onKeydown },
        dropdownMenuContent as any
      )
    }

    // TODO: 渲染筛选的图标
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
      interalVisible.value = visible;

      if (visible && filteredKeys.value !== undefined) {
        selectedKeys.value = ([] as TableColumnFilterValue[]).concat(filteredKeys.value ?? []) || [];
      }

      triggerVisible(visible);

      if (!visible && !props.customRenderFilterDropdown) {
        handleConfirm();
      }
    }

    // TODO: Menu 选中后的逻辑
    function handleSelectKeys({ selectedKeys: _selectedKeys }: { selectedKeys?: TableColumnFilterValue[] }) {
      selectedKeys.value = _selectedKeys;
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
          overlay: () => renderDropdownMenu(mergedFilter.value),
          default: () => renderDropdownTrigger({ filtered: filtered.value }),
        }
      )
    }
  }
})
</script>