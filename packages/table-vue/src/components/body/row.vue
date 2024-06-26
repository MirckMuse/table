<script lang="ts">
import type { RowData, RowKey, TableColumn } from "@scode/table-typing";
import type { PropType, StyleValue } from "vue";
import type { RowMeta, } from "@scode/table-state"
import { get, isNil } from 'lodash-es';
import { computed, defineComponent, h, mergeProps, ref } from 'vue';
import { useStateInject } from '../../hooks';
import type { CustomRow, ExpandIconSlot } from '../../typing';
import { BodyCellInheritProps } from '../../typing';
import { genGridTemplateColumns } from '../../utils';
import { renderExpandIcon } from '../../utils/constant';
import BodyCell from "./cell.vue";

export default defineComponent({
  name: "STableBodyRow",

  props: {
    rowKey: { type: [String, Number] as PropType<RowKey>, required: true },

    rowIndex: { type: Number, default: -1 },

    rowMeta: { type: Object as PropType<RowMeta> },

    record: { type: Object as PropType<RowData>, required: true },

    columns: { type: Array as PropType<TableColumn[]> },

    // 展开列
    expandColumn: { type: Object as PropType<TableColumn> },

    customRow: { type: Function as PropType<CustomRow> },

    expandIcon: { type: Function as PropType<ExpandIconSlot>, default: renderExpandIcon },

    grid: { type: Array as PropType<number[]> },

    isHover: { type: Boolean, default: false },

    ...BodyCellInheritProps,
  },


  setup(props) {
    const { handleRowExpand, expandedKeys, tableState } = useStateInject();

    const expanded = computed(() => {
      const { rowKey } = props;
      return !!expandedKeys.value?.has(rowKey);
    })

    // 是否存在嵌套子表格
    const hasNestChildren = computed(() => {
      const { childrenRowName, record } = props;
      return !!childrenRowName && !isNil(get(record, childrenRowName))
    });

    function getColWidth(column: TableColumn) {
      return tableState.value.colStateCenter.getColWidthByColumn(column);
    }

    function onInternalTriggerExpand($event: Event, record: RowData) {
      handleRowExpand($event, record)
    }

    // 创建单元格插槽
    function createCellSlot(column: TableColumn) {
      const slots: Record<string, any> = {};

      // 渲染展开图标
      if (column.expandable) {
        slots["expandIcon"] = () => {
          return props.expandIcon({
            expanded: expanded.value,
            expandable: hasNestChildren.value,
            record: props.record,
            onExpand: onInternalTriggerExpand
          });
        }
      }

      return slots;
    }

    // 渲染单元格
    function renderCell(column: TableColumn, record: RowData, meta?: RowMeta) {
      const rowIndex = meta?.index ?? -1;
      return h(
        BodyCell,
        {
          column,
          record,
          rowIndex,
          deep: meta?.deep ?? 0,
          transformCellText: props.transformCellText,
          bodyCell: props.bodyCell,
          "data-col-index": column.dataIndex,
          "data-col-key": column.key,
          "data-row-index": meta?.index,
          "data-row-key": meta?.key,
          "data-type": "cell"
        },
        createCellSlot(column)
      )
    }

    const PrefixClass = 's-table-body-row';
    const gridTemplateColumns = computed(() => {
      const { grid } = props;

      return (grid ?? []).map(width => `${width}px`).join(' ');
    })

    const rowRef = ref<HTMLElement>();

    // 渲染行数据
    function renderRow(columns: TableColumn[], record: RowData, hover: boolean) {
      const style: StyleValue = {};
      style.gridTemplateColumns = gridTemplateColumns.value;

      const { rowMeta, rowIndex } = props;

      const rowClass: Record<string, boolean> = {
        [PrefixClass]: true,
        [PrefixClass + "__hover"]: hover
      };

      const customRow = props.customRow ?? (() => ({}));

      return h(
        "div",
        mergeProps(
          customRow(record, rowIndex),
          { class: rowClass, "data-row-index": rowIndex, style, ref: rowRef },
        ),
        columns.map(col => renderCell(col, record, rowMeta))
      )
    }

    return () => {
      const { columns = [], record, isHover } = props;

      return renderRow(columns, record, isHover)
    }
  }
});
</script>

<style lang="less" scoped>
.s-table-body-row {
  display: grid;
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: var(--table-body-cell-bg);

  &__hover {
    background-color: var(--table-body-cell-bg-hover);
  }
}
</style>