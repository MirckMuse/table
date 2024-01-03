import type { ComputedRef, Ref } from "vue";
import { computed } from "vue";
import { RowData, RowKey } from "../typing";

export function useFlatten(
  dataSourceRef: Ref<RowData[]>,
  childrenColumnNameRef: Ref<string>,
  expandedKeysRef: ComputedRef<Set<RowKey>>,
  getRowKey: ComputedRef<(record: RowData) => RowKey>
) {

  return computed(() => {
    const childrenColumnName = childrenColumnNameRef.value;
    const expandedKeys = expandedKeysRef.value;
    const dataSource = dataSourceRef.value;

    if (expandedKeys.size) {

    }
  })
}