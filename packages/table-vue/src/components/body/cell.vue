<script lang="ts">
import type { PropType, StyleValue } from "vue";
import type { RowData, TableColumn } from "@scode/table-typing";
import { get } from "lodash-es";
import { Comment, computed, defineComponent, h, isVNode, mergeProps, ref } from "vue";
import { useSelectionInject } from "../../hooks";
import { BodyCellInheritProps } from "../../typing";
import { isShowTitle, toArray } from "../../utils";

export default defineComponent({
  name: "STableBodyCell",

  props: {
    column: { type: Object as PropType<TableColumn>, required: true },

    record: { type: Object as PropType<RowData>, required: true },

    rowIndex: { type: Number, required: true },

    deep: { type: Number, default: 0 },

    // indentSize 需要从外面传递过来
    indentSize: { type: String, default: "16px" },

    selection: {},

    ...BodyCellInheritProps,
  },

  setup(props, { slots }) {
    const cellRef = ref<HTMLElement>();
    const cellInnerRef = ref<HTMLElement>();

    const { selection_state } = useSelectionInject();

    function getText(column?: TableColumn, record?: RowData): unknown | null {
      if (!column?.dataIndex) return null;

      return get(record, column?.dataIndex, null)
    }

    const prefixClass = "s-table-body-cell";

    function getSelectionClass() {
      const {
        column,
        rowIndex
      } = props

      const { colKeys = [], startRowIndex, endRowIndex } = selection_state || {};
      if (!colKeys.length || startRowIndex === -1 || endRowIndex === -1) {
        return {}
      }

      if (column.key && colKeys.includes(column.key) && startRowIndex <= rowIndex && rowIndex <= endRowIndex) {
        const clas: Record<string, boolean> = {
          [`${prefixClass}-selection`]: true,
        }

        if (colKeys[0] === column.key) {
          clas[`${prefixClass}-selection__left`] = true
        }
        if (colKeys[colKeys.length - 1] === column.key) {
          clas[`${prefixClass}-selection__right`] = true
        }
        if (startRowIndex === rowIndex) {
          clas[`${prefixClass}-selection__top`] = true
        }
        if (endRowIndex === rowIndex) {
          clas[`${prefixClass}-selection__bottom`] = true
        }
        return clas
      }

      return {}
    }

    const cellClass = computed(() => {
      return {
        [prefixClass]: true,
        ...getSelectionClass(),
      }
    });

    const cellInnerClass = computed(() => {
      const { column } = props;
      return {
        [`${prefixClass}-inner`]: true,
        [`${prefixClass}-inner-ellipsis`]: !!column.ellipsis
      }
    })

    const cellInnerStyle = computed<StyleValue>(() => {

      const style: StyleValue = {};

      style.textAlign = props.column?.align;
      if (slots["expandIcon"]) {
        const { deep, indentSize } = props;
        style.paddingLeft = `calc(${deep} * ${indentSize})`
      }

      return style
    });

    const text = computed(() => {
      const { column, record } = props;

      return getText(column, record)?.toString() ?? undefined;
    });

    // 判断是否需要在单元格上显示 title。
    const showTitle = computed(() => isShowTitle(props.column));
    const title = computed(() => showTitle.value ? text.value : undefined);

    const cellBind = computed(() => {
      const { column, record, rowIndex } = props;
      return column.customCell?.({ record, index: rowIndex, column }) ?? {}
    });

    function isValidVNode(target: unknown): boolean {
      if (!isVNode(target)) return true;

      return target.type !== Comment
    }

    function renderCustomCell(): any[] | null {
      const { column, rowIndex, record } = props;

      const params = { text: text.value, record, column, index: rowIndex, title: title.value }

      if (column.customRender) {
        return toArray(column.customRender(params))
      }

      const bodyCellVNodes = props.bodyCell?.(params)

      const validVNodes = toArray(bodyCellVNodes).filter(isValidVNode)

      return validVNodes.length ? validVNodes : null;
    }

    const cellStyle = computed(() => {
      const style: StyleValue = {};
      return style;
    })

    return () => {
      const contentVNodes = renderCustomCell();

      const children = contentVNodes ?? text.value;

      const { column, record, rowIndex } = props;

      const expandIcon = slots["expandIcon"];

      const inner = h(
        "div",
        { class: cellInnerClass.value, style: cellInnerStyle.value, ref: cellInnerRef },

        [expandIcon ? expandIcon() : null].concat(props.transformCellText?.({ text: children, column, record, index: rowIndex }) ?? children)
      )

      const cell = h(
        "div",
        mergeProps({
          class: cellClass.value,
          ref: cellRef,
          title: title.value,
          style: cellStyle.value,
        }, cellBind.value),
        [
          inner
        ]
      )

      return cell;
    }
  }
})
</script>
