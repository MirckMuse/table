import type { ColKey, RowData, RowKey } from "@scode/table-typing";

type META = { col_key: ColKey, dataIndex?: string, sorter: boolean };

// 判断是否为 null 或者 undefine
function isNil(value: unknown): boolean {
  return value === null || value === undefined;
}

type ColOrderMap = Map<ColKey, number>;

type OrderMap = Map<RowKey, ColOrderMap>;

// 更新 order map。
function update_order_map(row_data: RowData, columns: META[], orderMap: OrderMap) {
  const row_key = row_data.__SCode_Row_Key__;

  const _map = orderMap.get(row_key) ?? new Map<ColKey, number>();

  for (const column of columns) {
    const { col_key, dataIndex } = column;

    const raw_data = row_data.__SCode_Origin_Data__

    const value = dataIndex
      ? raw_data[dataIndex] ?? 0
      : -Infinity;

    if (isNil(value)) {
      _map.set(col_key, 0)
    } else if (typeof value === 'number') {
      _map.set(col_key, value)
    } else if (typeof value === 'string') {
      _map.set(col_key, [...value].reduce((v, char) => v + char.charCodeAt(0), 0))
    } else {
      _map.set(col_key, Infinity)
    }
  }

  orderMap.set(row_key, _map);
}

function init(row_data_metas: RowData[], last_column: META[]) {
  const map: OrderMap = new Map();

  const sorter_columns = last_column.filter(column => column.sorter);

  for (const row_data_meta of row_data_metas) {
    update_order_map(row_data_meta, sorter_columns, map);
  }

  return map;
}

self.onmessage = ($event: MessageEvent) => {

  const { metas, columns } = $event.data as { metas: RowData[], columns: META[] };

  const result = init(metas, columns);

  self.postMessage(result);

  self.close();
}