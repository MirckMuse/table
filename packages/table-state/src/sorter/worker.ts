import type { ColKey, RowDataMeta } from "@scode/table-typing";

type META = { col_key: ColKey, dataIndex?: string, sorter: boolean };

function _process(row_data_metas: RowDataMeta[], last_column: META[]) {
  const map = new Map();

  const sorter_columns = last_column.filter(column => column.sorter);
  row_data_metas.forEach(row_data_meta => {
    const _map = map.get(row_data_meta.key) ?? new Map();

    sorter_columns.forEach(_meta => {
      const { col_key, dataIndex } = _meta;

      const value = dataIndex
        ? row_data_meta.data[dataIndex] ?? 0
        : -Infinity;

      if (value === null || value === undefined) {
        _map.set(col_key, 0)
      } else if (typeof value === 'number') {
        _map.set(col_key, value)
      } else if (typeof value === 'string') {
        _map.set(col_key, [...value].reduce((v, char) => v + char.charCodeAt(0), 0))
      } else {
        _map.set(col_key, Infinity)
      }
    })

    map.set(row_data_meta.key, _map);
  });

  return map;
}

self.onmessage = ($event: MessageEvent) => {

  const { metas, columns } = $event.data as { metas: RowDataMeta[], columns: META[] };

  const result = _process(metas, columns);

  self.postMessage(result);
}