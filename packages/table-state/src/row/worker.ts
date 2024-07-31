import type { RowData, RowKey } from "@scode/table-typing";

self.onmessage = ($event: MessageEvent) => {
  const data = $event.data;

  if (data.type === "get_all_expand_keys") {
    function get_all_expand_keys(row_datas: RowData[]) {
      const row_key: RowKey[] = [];

      for (const row_data of row_datas) {
        if (row_data.__SCode_Expand_Keys__?.length) {
          row_key.push(...row_data.__SCode_Expand_Keys__)
        }
      }

      return Array.from(new Set(row_key));
    }

    self.postMessage(get_all_expand_keys(data.data));
  }
}