<script lang="ts">
import type { FilterState, TableColumn, TableColumnFilter, TableColumnFilterOption, TableColumnFilterValue } from "@scode/table-typing";
import type { PropType, VNode } from "vue";
import type { DataNode } from "ant-design-vue/es/tree";

import { computed, defineComponent, h, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Dropdown, Button, Empty, Menu, Checkbox, Radio, Tree } from "ant-design-vue";
import { RiFilter2Fill } from "@remixicon/vue";
import { stopPropagation } from "../../utils"
import { isEqual, isNil } from "lodash-es";
import { flattenKeys } from "@scode/table-shared";
import FilterSearch from "./Search.vue";

type VNodeOrNull = VNode | null;

interface FilterResetProps {
  confirm?: boolean;

  closeDropdown?: boolean;
}

// 默认的筛选项的 reset 的属性。
const DefaultFilterResetProps: FilterResetProps = {
  confirm: false,
  closeDropdown: false,
}

// 默认的表格筛选配置。
const DefaultTableColumnFilter: TableColumnFilter = { mode: "menu", multiple: true };

type CustomRenderFilterDropdown = Function;

interface RenderDropdownMenuOption {
  filter: TableColumnFilter;

  keyword: string;

  customRenderFilterDropdown?: CustomRenderFilterDropdown;

  column: TableColumn;

  visible: boolean;

  selectedKeys?: TableColumnFilterValue[];

  openKeys?: TableColumnFilterValue[];

  treeData?: DataNode[];
}

interface RenderDropdownMenuContentOption extends RenderDropdownMenuOption {
}

function genTreeData(options?: TableColumnFilterOption[]): DataNode[] | undefined {
  return options?.map((option, index) => {
    const key = String(option.value ?? index);

    const item: DataNode = {
      title: option.label,
      key: key,
    }

    if (option.children) {
      item.children = genTreeData(option.children)
    }

    return item;
  });
}

export default defineComponent({
  name: "STableFilter",

  props: {
    filter: { type: Object as PropType<TableColumnFilter>, required: true },

    filterState: { type: Object as PropType<FilterState> },

    column: { type: Object as PropType<TableColumn>, required: true },

    triggerFilter: { type: Function as PropType<(filterKeys: TableColumnFilterValue[], column: TableColumn) => void> },

    customRenderFilterDropdown: { type: Function as PropType<CustomRenderFilterDropdown> },

    getPopupContainer: { type: Function as PropType<(target: HTMLElement) => HTMLElement> }
  },

  setup(props) {
    const prefixClass = "s-table-filter"

    const keywords = shallowRef("");
    function handleSearch($event: any) {
      keywords.value = $event.target?.value ?? "";
    }

    function getFilterData(node: any): TableColumnFilterOption {
      return {
        ...node,
        label: node.title,
        value: node.key,
        children: node.children?.map(getFilterData)
      }
    }

    // 创建树的筛选函数
    function createFilterTreeNode(keyword: string, filter: TableColumnFilter) {
      const _keyword = keyword.trim().toLowerCase() ?? ""
      if (!_keyword) return undefined;

      const { search } = filter;

      if (typeof search === "function") {
        return (node: any) => {
          return search(_keyword, getFilterData(node))
        }
      }

      return (node: any) => {
        const label = node.text;
        if (typeof label === "string" || typeof label === "number") {
          return label.toString().toLowerCase().includes(_keyword)
        }
        return false
      }
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

      handleSelectKeys({ selectedKeys: _selectedKeys ?? [] })
    }, { immediate: true });

    // TODO: 扁平的筛选keys，提供树组件使用
    const flattenFilteredKeys = computed(() => {
      const { options, mode } = mergedFilter.value;

      if (mode !== "tree") {
        return []
      }

      return flattenKeys<TableColumnFilterValue>(options)
    });

    const onFilterDropdownOpenChange = computed(() => props.filter.onOpenChange)

    const filtered = computed(() => {
      if (!props.filterState) return false;

      const { filterKeys, forceFilter } = props.filterState;
      return !!(filterKeys?.length || forceFilter)
    });

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

      triggerFilter?.(_keys ?? [], column)
    }

    // 渲染表单项
    function renderFilterMenuItems(filter: TableColumnFilter): VNode[] {
      return filter.options!.map((option, index) => {
        const optionKey = isNil(option.value) ? String(index) : String(option.value);
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
          h(Component, { checked: selectedKeys.value?.includes(optionKey) }),
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

    const treeData = computed(() => {
      const { mode, options } = props.filter;

      if (mode !== "tree") return [];

      return genTreeData(options);
    })

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
    function renderDropdownMenuContent(option: RenderDropdownMenuContentOption): VNodeOrNull[] {
      let {
        filter,
        keyword: _keyword,
        selectedKeys: _selectedKeys,
        openKeys: _openKeys,
        treeData: _treeData
      } = option;


      _selectedKeys = (_selectedKeys ?? []).map(value => String(value));
      _openKeys = (_openKeys ?? []).map(value => String(value));

      const {
        options = [],
        multiple = true,
        mode = "menu",
        search
      } = filter;

      // 渲染下拉选项
      let filterComponent: VNodeOrNull | VNodeOrNull[] = null;
      if (options.length === 0) {
        filterComponent = h(Empty)
      } else if (mode === "tree") {

        const _filterTreeNode = createFilterTreeNode(_keyword, filter);
        filterComponent = [
          h(FilterSearch, {
            filterSearch: search,
            value: _keyword,
            onChange: handleSearch
          }),
          h("div", { class: `${prefixClass}__dropdown-tree` }, [
            multiple ? h(Checkbox) : null,
            h(Tree, {
              checkable: true,
              selectable: false,
              blockNode: true,
              multiple: multiple,
              checkStrictly: !multiple,
              class: `${prefixClass}-menu`,
              checkedKeys: _selectedKeys,
              selectedKeys: _selectedKeys,
              showIcon: false,
              treeData: _treeData,
              autoExpandParent: true,
              defaultExpandAll: true,
              filterTreeNode: _filterTreeNode
            })
          ])
        ];
      } else if (mode === "menu") {
        filterComponent = [
          h(FilterSearch, {
            filterSearch: search,
            value: _keyword,
            onChange: handleSearch
          }),
          h(
            Menu,
            {
              multiple,
              // prefixCls: `${prefixClass}__dropdown-menu`,
              selectedKeys: _selectedKeys,
              openKeys: _openKeys,
              onClick: handleMenuClick,
              onSelect: handleSelectKeys,
              onDeselect: handleSelectKeys,
              getPopupContainer: props.getPopupContainer,
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
    function renderDropdownMenu(option: RenderDropdownMenuOption) {
      const {
        filter,
        customRenderFilterDropdown,
        selectedKeys,
        column,
        visible
      } = option;

      const _onKeydown = ($event: KeyboardEvent) => {
        if ($event.code === "Enter" || $event.keyCode === 13) {
          $event.stopPropagation();
        }
      }
      const dropdownMenuContent = customRenderFilterDropdown
        ? customRenderFilterDropdown({
          visible: visible,
          column: column,
          options: filter.options,
          setSelectedKeys: (keys: TableColumnFilterValue[]) => handleSelectKeys({ selectedKeys: keys }),
          selectedKeys: selectedKeys,
          onConfirm: handleCustomConfirm,
          onReset: handleReset,
          onClose: () => triggerVisible(false)
        })
        : renderDropdownMenuContent(option);

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

    // 处理下拉菜单的 visible
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

    // Menu 选中后的逻辑
    function handleSelectKeys({ selectedKeys: _selectedKeys }: { selectedKeys: TableColumnFilterValue[] }) {
      selectedKeys.value = _selectedKeys;
    }

    return () => {
      return h(
        Dropdown,
        {
          trigger: ["click"],
          open: mergedVisible.value,
          onOpenChange: handleDropdownOpenChange,
          getPopupContainer: props.getPopupContainer,
          placement: "bottomRight",
          forceRender: true
        },
        {
          overlay: () => renderDropdownMenu({
            filter: mergedFilter.value,
            keyword: keywords.value,
            customRenderFilterDropdown: props.customRenderFilterDropdown,
            column: props.column,
            selectedKeys: selectedKeys.value,
            openKeys: openKeys.value,
            visible: mergedVisible.value,
            treeData: treeData.value,
          }),
          default: () => renderDropdownTrigger({ filtered: filtered.value }),
        }
      )
    }
  }
})
</script>