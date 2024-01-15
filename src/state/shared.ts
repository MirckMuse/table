import { chunk } from "lodash-es";
import { GetRowKey, RowData, RowKey } from "../table/typing";
import { RowMeta, TableRowState, TableRowStateCenter, TableRowStateOrNull } from "./row";
import { runIdleTask } from "../table/utils";

interface ICreateRawStateMapOption {
  // 初始粗略的高度
  roughHeight: number;

  getRowKey?: GetRowKey;

  deep?: number;

  map?: Map<RowKey, TableRowState>;

  keyMap?: WeakMap<RowData, RowKey>;

  rawRowKeys?: RowKey[],

  flattenRowKeys?: RowKey[],

  updateTableView?: () => void,

  rowStateCenter: TableRowStateCenter
}

// 创建原始
export function initRawState(dataSource: RowData[], option: ICreateRawStateMapOption) {
  const {
    getRowKey,
    roughHeight,
    deep = 0,
    map: rawStateMap = new Map(),
    keyMap = new WeakMap(),
    rawRowKeys = [],
    flattenRowKeys = [],
    updateTableView,
    rowStateCenter
  } = option;


  // 创建行的元数据
  function _createMeta(record: RowData, index: number, prevState: TableRowStateOrNull): RowMeta {
    let y = 0;
    if (prevState) {
      const meta = prevState.getMeta();
      y = meta.height + meta.y;
    }
    return {
      key: getRowKey ? getRowKey(record) : `${deep}-${index}`,
      index,
      deep,
      height: roughHeight,
      y,
    }
  }

  let prevState: TableRowStateOrNull = null;

  // 创建表格数据行的状态
  function _createTableRowState(record: RowData, index: number) {
    const meta = _createMeta(record, index, prevState)

    const state = new TableRowState({
      record,
      meta,
      prev: prevState,
      next: null,
      rowStateCenter
    })

    if (prevState) {
      prevState.updateNext(state)
    }

    return state
  }

  const _chunkSize = 200;
  const chunks = chunk(dataSource, _chunkSize);
  function _update(_chunk: RowData[], chunkIndex: number) {
    _chunk.forEach((record, index) => {
      const state = _createTableRowState(record, index + chunkIndex * _chunkSize);
      const rowKey = state.getMeta().key;
      rawStateMap.set(rowKey, state);
      prevState = state;
      rawRowKeys.push(rowKey);
      flattenRowKeys.push(rowKey);
      keyMap.set(record, rowKey);
    })

    updateTableView?.();
  }

  _update(chunks[0], 0);

  for (let i = 1; i < chunks.length; i++) {
    runIdleTask(() => {
      _update(chunks[i], i);
    });
  }
}
