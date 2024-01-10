import { GetRowKey, RowData, RowKey } from "../table/typing";
import { RowMeta, TableRowState, TableRowStateOrNull } from "./row";

interface ICreateRawStateMapOption {
  // 初始粗略的高度
  roughHeight: number;

  getRowKey?: GetRowKey;

  startIndex?: number;

  deep?: number;

  map?: Map<RowKey, TableRowState>;

  keyMap?: WeakMap<RowData, RowKey>;
}

// 创建原始
export function initRawState(dataSource: RowData[], option: ICreateRawStateMapOption) {
  const {
    getRowKey,
    roughHeight,
    deep = 0,
    map: rawStateMap = new Map(),
    keyMap = new WeakMap(),
    startIndex = 0
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
    const meta = _createMeta(record, index + startIndex, prevState)

    return new TableRowState({
      record,
      meta,
      prev: prevState,
      next: null
    })
  }

  const rowKeys: RowKey[] = [];
  dataSource.forEach((record, index) => {
    const state = _createTableRowState(record, index);
    const rowKey = state.getMeta().key;
    rawStateMap.set(rowKey, state);
    prevState = state;
    rowKeys.push(rowKey);
    keyMap.set(record, rowKey);
  })
  return {
    stateMap: rawStateMap,
    rowKeys
  }
}
