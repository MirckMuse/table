import { Checkbox } from "ant-design-vue";
import { h, ref, type Ref, type UnwrapRef } from "vue";
import type { GetRowKey, InternalTableRowSelection, Option, RawData, RowKey, TableColumn, TableProps } from "../typing";
import { getDFSLastColumns, noop } from "../utils";
import type { CheckboxChangeEvent } from "ant-design-vue/es/checkbox/interface";
import type { TableState } from "@scode/table-state";

export const Default_Row_Selection: InternalTableRowSelection = {
  checkStrictly: true,
  fixed: false,
  columnWidth: 48,
  columnTitle() {
    // TODO:
    return null;
  },

  getCheckboxProps: noop,

  hideDefaultSelections: false,
  hideSelectAll: false,
  preserveSelectedRowKeys: true,

  selectedRowKeys: [],

  selections: false,

  type: "checkbox",
  onChange: noop,
  onSelect: noop,
  onSelectAll: noop,
  onSelectInvert: noop,
  onSelectNone: noop,
}

export function normalizeRowSelection(tableProps: TableProps): Option<InternalTableRowSelection> {
  const rowSelection = tableProps.rowSelection;

  if (!rowSelection) return null;

  const _row_selection = Object.assign({}, Default_Row_Selection);

  if (typeof rowSelection === "object") {
    Object.assign(_row_selection, rowSelection)
  }

  // 如果存在某一列 fixed 左侧，需要
  const exist_left_fixed = getDFSLastColumns(tableProps.columns || []).some(column => column.fixed === "left" || column.fixed === true);

  if (exist_left_fixed) {
    _row_selection.fixed = true;
  }

  return _row_selection;
}



export function useRowSelection(tableProps: TableProps, option: { getRowKey: GetRowKey }) {
  const internal_row_selection = ref(normalizeRowSelection(tableProps));

  const selectedRawDatas: RawData[] = [];

  const selectedRowKeysSet = new Set<RowKey>();

  function onChange(isChecked: boolean, record: RawData, row_key: RowKey) {

    if (isChecked) {
      selectedRawDatas.push(record);
      selectedRowKeysSet.add(row_key);
      internal_row_selection.value?.selectedRowKeys.push(row_key);
    } else {
      selectedRowKeysSet.delete(row_key);
      const matched_index = selectedRawDatas.findIndex(raw_data => raw_data === record);
      if (matched_index !== -1) {
        selectedRawDatas.splice(matched_index, 1);
      }

      const matched_row_key_index = internal_row_selection.value?.selectedRowKeys.findIndex(_row_key => _row_key === row_key);
      if (matched_row_key_index !== -1) {
        internal_row_selection.value?.selectedRowKeys.splice(matched_index, 1);
      }
    }
  }

  function convertRowSelectionToColumn(rowSelection: InternalTableRowSelection): TableColumn {
    return {
      title() {
        return h(Checkbox)
      },
      width: rowSelection.columnWidth,
      fixed: rowSelection.fixed,
      customRender({ record, index }) {
        const row_key = option.getRowKey(record, index);

        return h(Checkbox, {
          checked: selectedRowKeysSet.has(row_key),
          onChange: ($event: CheckboxChangeEvent) => onChange($event.target.checked, record, row_key)
        })
      }
    }
  }

  return {
    internal_row_selection,
    convertRowSelectionToColumn
  }
}
