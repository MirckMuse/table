<script lang="ts">
import { PropType, StyleValue, computed, defineComponent, h, mergeProps, openBlock, ref, onMounted } from 'vue';
import { BodyCellInheritProps, CustomRow, ExpandIconSlot } from '../../typing';
import { RowData, RowKey, TableColumn } from "@stable/table-typing"
import BodyCell from "./cell.vue"
import { genGridTemplateColumns } from '../../utils';
import { useStateInject } from '../../hooks';
import { EXPAND_COLUMN, renderExpandIcon } from '../../utils/constant';
import { get, isNil } from 'lodash-es';
import { RowMeta } from '../../../state/row';

export default defineComponent({
  name: "STableBodyRow",

  props: {
    rowKey: { type: [String, Number] as PropType<RowKey>, required: true },

    rowIndex: { type: Number, default: -1 },

    rowMeta: { type: Object as PropType<RowMeta> },

    record: { type: Object as PropType<RowData>, required: true },

    columns: { type: Array as PropType<TableColumn[]> },

    customRow: { type: Function as PropType<CustomRow> },

    expandIcon: { type: Function as PropType<ExpandIconSlot>, default: renderExpandIcon },

    childrenColumnName: { type: String, default: 'children' },

    ...BodyCellInheritProps,
  },


  setup(props) {
    const { tableState, handleRowExpand, expandedKeys } = useStateInject();

    const expanded = computed(() => {
      const { rowKey } = props;
      return !!expandedKeys.value?.has(rowKey);
    })

    // 是否存在嵌套子表格
    const hasNestChildren = computed(() => {
      const { childrenColumnName, record } = props;
      return !!childrenColumnName && !isNil(get(record, childrenColumnName))
    });

    function onInternalTriggerExpand($event: Event, record: RowData) {
      handleRowExpand($event, record)
    }

    // 创建单元格插槽
    function createCellSlot(column: TableColumn) {
      // const specialColumnMap = tableState.value.specialColumnMap.get(column) ?? [];
      const specialColumnMap: any[] = [];

      const slots: Record<string, any> = {};

      // 渲染展开图标
      if (specialColumnMap.includes(EXPAND_COLUMN)) {
        slots.expandIcon = () => {
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
      const { columns } = props;
      return genGridTemplateColumns(columns ?? []);
    })

    const rowRef = ref<HTMLElement>();

    // 渲染行数据
    function renderRow(columns: TableColumn[], record: RowData) {
      const style: StyleValue = {};
      style.gridTemplateColumns = gridTemplateColumns.value;

      const {
        rowMeta,
        rowIndex,
        rowKey
      } = props;

      const rowClass: Record<string, boolean> = {
        [PrefixClass]: true,
        [PrefixClass + "__hover"]: rowKey === tableState.value.hoverState.rowKey
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

    return function () {
      const { columns = [], record } = props;

      return renderRow(columns, record)
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