import { isNil, chunk, groupBy } from 'lodash-es';
import { runIdleTask, binaryFindIndexRange } from '@stable/table-shared';

const DefaultColWidth = 120;
const ColKeySplitWord = "__$$__";
// 列信息状态
class TableColState {
    getMeta() {
        return Object.assign({}, this.meta);
    }
    updateMeta(meta) {
        Object.assign(this.meta, meta);
    }
    constructor(option) {
        this.colStateCenter = option.colStateCenter;
        this.meta = option.meta;
        this.column = option.column;
    }
    updateColWidth(width) {
        this.updateMeta({ width });
    }
}
class TableColStateCenter {
    constructor(option) {
        // 左侧
        this.leftColKeys = [];
        this.lastLeftColKeys = [];
        // 中间
        this.centerColKeys = [];
        this.lastCenterColKeys = [];
        // 右侧
        this.rightColKeys = [];
        this.lastRightColKeys = [];
        // 列 key 的映射
        this.colKeyMap = new WeakMap();
        this.childrenMap = new WeakMap();
        this.parentMap = new WeakMap();
        this.colStateMap = new Map();
        this.maxTableHeaderDeep = 0;
        this.tableState = option.tableState;
    }
    init() {
        this.leftColKeys = [];
        this.lastLeftColKeys = [];
        this.centerColKeys = [];
        this.lastCenterColKeys = [];
        this.rightColKeys = [];
        this.lastRightColKeys = [];
    }
    getStateByColKey(colKey) {
        var _a;
        return (_a = this.colStateMap.get(colKey)) !== null && _a !== void 0 ? _a : null;
    }
    getStateByColumn(column) {
        if (isNil(column))
            return null;
        const colKey = this.colKeyMap.get(column);
        if (isNil(colKey))
            return null;
        return this.getStateByColKey(colKey);
    }
    getColumnByColKey(colKey) {
        var _a, _b;
        return (_b = (_a = this.getStateByColKey(colKey)) === null || _a === void 0 ? void 0 : _a.column) !== null && _b !== void 0 ? _b : null;
    }
    updateColumns(columns) {
        this.init();
        let maxDeep = -1;
        const _createColMeta = (column, index, parent) => {
            var _a, _b, _c, _d, _e;
            const parentColState = this.getStateByColumn(parent);
            const deep = ((_a = parentColState === null || parentColState === void 0 ? void 0 : parentColState.getMeta().deep) !== null && _a !== void 0 ? _a : -1) + 1;
            maxDeep = Math.max(maxDeep, deep);
            const key = [(_c = (_b = column.key) !== null && _b !== void 0 ? _b : column.dataIndex) !== null && _c !== void 0 ? _c : "", index, deep].join(ColKeySplitWord);
            return {
                key,
                width: (_d = column.width) !== null && _d !== void 0 ? _d : DefaultColWidth,
                deep: deep,
                isLeaf: !((_e = column.children) === null || _e === void 0 ? void 0 : _e.length),
                colSpan: isNil(column.colSpan) ? 1 : column.colSpan
            };
        };
        const _createState = (column, index, parent) => {
            const meta = _createColMeta(column, index, parent);
            return new TableColState({
                column,
                meta,
                colStateCenter: this,
            });
        };
        const _initState = (column, index, parent) => {
            var _a;
            const state = _createState(column, index, parent);
            const colKey = state.getMeta().key;
            this.colKeyMap.set(column, colKey);
            this.parentMap.set(column, parent);
            if (parent) {
                const children = (_a = this.childrenMap.get(parent)) !== null && _a !== void 0 ? _a : [];
                children.push(column);
                this.childrenMap.set(parent, children);
            }
            this.colStateMap.set(colKey, state);
        };
        const _notFixedColumn = (column) => {
            return column.fixed !== true && column.fixed !== "left" && column.fixed !== "right";
        };
        const fixedLeftIndex = columns.findIndex(_notFixedColumn) - 1;
        const fixedRightIndex = columns.findLastIndex(_notFixedColumn) + 1;
        const leftColKeyMap = new Map();
        const centerColKeyMap = new Map();
        const rightColKeyMap = new Map();
        const _isLeft = (index, root) => {
            var _a;
            if (root) {
                const colKeys = (_a = leftColKeyMap.get(0)) !== null && _a !== void 0 ? _a : [];
                const colKey = this.colKeyMap.get(root);
                return colKey ? colKeys.includes(colKey) : false;
            }
            return fixedLeftIndex >= index;
        };
        const _isRight = (index, root) => {
            var _a;
            if (root) {
                const colKeys = (_a = rightColKeyMap.get(0)) !== null && _a !== void 0 ? _a : [];
                const colKey = this.colKeyMap.get(root);
                return colKey ? colKeys.includes(colKey) : false;
            }
            return index >= fixedRightIndex;
        };
        const _updateKeyMap = (map, state) => {
            var _a, _b;
            const deep = (_a = state.getMeta().deep) !== null && _a !== void 0 ? _a : 0;
            const colKeys = (_b = map.get(deep)) !== null && _b !== void 0 ? _b : [];
            colKeys.push(state.getMeta().key);
            map.set(deep, colKeys);
        };
        const _task = (colums, parent = null, root = null) => {
            colums.forEach((column, index) => {
                var _a, _b, _c, _d;
                _initState(column, index, parent);
                const state = this.getStateByColumn(column);
                if (state) {
                    const colKey = state.getMeta().key;
                    if (_isLeft(index, root)) {
                        _updateKeyMap(leftColKeyMap, state);
                        if (!((_a = column.children) === null || _a === void 0 ? void 0 : _a.length)) {
                            this.lastLeftColKeys.push(colKey);
                        }
                    }
                    else if (_isRight(index, root)) {
                        _updateKeyMap(rightColKeyMap, state);
                        if (!((_b = column.children) === null || _b === void 0 ? void 0 : _b.length)) {
                            this.lastRightColKeys.push(colKey);
                        }
                    }
                    else {
                        _updateKeyMap(centerColKeyMap, state);
                        if (!((_c = column.children) === null || _c === void 0 ? void 0 : _c.length)) {
                            this.lastCenterColKeys.push(colKey);
                        }
                    }
                }
                if ((_d = column.children) === null || _d === void 0 ? void 0 : _d.length) {
                    _task(column.children, column, root || column);
                }
            });
        };
        _task(columns);
        this.maxTableHeaderDeep = maxDeep;
        this.leftColKeys = Array.from(leftColKeyMap.values()).flat(1);
        this.centerColKeys = Array.from(centerColKeyMap.values()).flat(1);
        this.rightColKeys = Array.from(rightColKeyMap.values()).flat(1);
        const _updateSpan = (colKey) => {
            var _a;
            const state = this.getStateByColKey(colKey);
            if (!state)
                return;
            const children = this.childrenMap.get(state.column);
            if (children === null || children === void 0 ? void 0 : children.length) {
                state.updateMeta({
                    colSpan: children.reduce((prev, next) => {
                        var _a, _b;
                        return ((_b = (_a = this.getStateByColumn(next)) === null || _a === void 0 ? void 0 : _a.getMeta().colSpan) !== null && _b !== void 0 ? _b : 1) + prev;
                    }, 0)
                });
            }
            if (state.getMeta().isLeaf) {
                state.updateMeta({
                    rowSpan: maxDeep + 1 - ((_a = state.getMeta().deep) !== null && _a !== void 0 ? _a : 0)
                });
            }
        };
        this.leftColKeys.forEach(_updateSpan);
        this.centerColKeys.forEach(_updateSpan);
        this.rightColKeys.forEach(_updateSpan);
    }
}

class TableRowState {
    getMeta() {
        return Object.assign({}, this.meta);
    }
    updateMeta(meta) {
        Object.assign(this.meta, meta);
    }
    constructor(option) {
        this.rowData = option.rowData;
        this.meta = option.meta;
        this.rowStateCenter = option.rowStateCenter;
    }
    updateHeight(height) {
        this.updateMeta({ height });
    }
}
const DefaultRowHeight = 55;
const ChunkSize = 100;
class TableRowStateCenter {
    constructor(option) {
        var _a, _b;
        // 原始行 keys
        this.rawRowKeys = [];
        // 展开行的 key值
        this.flattenRowKeys = [];
        // 展示行的 Y 坐标值
        this.flattenYIndexes = [];
        // rowKey => TableRowState 映射关系
        this.rowStateMap = new Map();
        this.rowKeyMap = new WeakMap;
        this.tableState = option.tableState;
        this.roughRowHeight = (_a = option.rowHeight) !== null && _a !== void 0 ? _a : DefaultRowHeight;
        this.getRowKey = (_b = option.getRowKey) !== null && _b !== void 0 ? _b : (() => -1);
    }
    // 初始化一些关键属性
    init() {
        this.rowStateMap.clear();
        this.rawRowKeys = [];
        this.flattenRowKeys = [];
        this.flattenYIndexes = [];
        this.rowKeyMap = new WeakMap;
    }
    // 更新行数据
    updateRowDatas(rowDatas) {
        this.init();
        // 粗略估计一下可视高度
        this.tableState.viewport.scrollHeight = rowDatas.length * this.roughRowHeight;
        this.flattenYIndexes = Array(rowDatas.length).fill(null).map((_, i) => (i + 1) * this.roughRowHeight);
        // 生成行数据的 meta
        const _createRowStateMeta = (rowData, index) => {
            return {
                key: this.getRowKey ? this.getRowKey(rowData) : `0-${index}`,
                index,
                deep: 0,
                height: this.roughRowHeight,
                _sort: index.toString(),
            };
        };
        // 生成行数据的状态
        const _createRowState = (rowData, index) => {
            const meta = _createRowStateMeta(rowData, index);
            return new TableRowState({
                rowData: rowData,
                meta,
                rowStateCenter: this,
            });
        };
        const _task = (oneChunk, chunkIndex) => {
            oneChunk.forEach((rowData, index) => {
                const state = _createRowState(rowData, index + chunkIndex * ChunkSize);
                const rowKey = state.getMeta().key;
                this.rawRowKeys.push(rowKey);
                this.rowStateMap.set(rowKey, state);
                this.flattenRowKeys.push(rowKey);
                this.rowKeyMap.set(rowData, rowKey);
            });
        };
        const chunks = chunk(rowDatas, ChunkSize);
        _task(chunks[0], 0);
        for (let i = 1; i < chunks.length; i++) {
            runIdleTask(() => _task(chunks[i], i));
        }
    }
    getStateByRowData(rowData) {
        const rowKey = this.rowKeyMap.get(rowData);
        if (isNil(rowKey))
            return null;
        return this.getStateByRowKey(rowKey);
    }
    getStateByRowKey(rowKey) {
        var _a;
        return (_a = this.rowStateMap.get(rowKey)) !== null && _a !== void 0 ? _a : null;
    }
    getStateByFlattenIndex(index) {
        const rowKey = this.flattenRowKeys[index];
        if (isNil(rowKey))
            return null;
        return this.getStateByRowKey(rowKey);
    }
    getRowHeight(state) {
        var _a;
        return (_a = state === null || state === void 0 ? void 0 : state.getMeta().height) !== null && _a !== void 0 ? _a : this.roughRowHeight;
    }
    getRowHeightByRowKey(rowKey) {
        return this.getRowHeight(this.getStateByRowKey(rowKey));
    }
    getRowHeightByRowData(rowData) {
        var _a;
        const rowKey = (_a = this.getStateByRowData(rowData)) === null || _a === void 0 ? void 0 : _a.getMeta().key;
        if (isNil(rowKey))
            return 0;
        return this.getRowHeightByRowKey(rowKey);
    }
    getRowHeightByFlattenIndex(index) {
        const rowKey = this.flattenRowKeys[index];
        if (isNil(rowKey))
            return this.roughRowHeight;
        return this.getRowHeightByRowKey(rowKey);
    }
    getRowDataByRowKey(rowKey) {
        var _a, _b;
        return (_b = (_a = this.getStateByRowKey(rowKey)) === null || _a === void 0 ? void 0 : _a.rowData) !== null && _b !== void 0 ? _b : null;
    }
    getRowDataByFlattenIndex(index) {
        const rowKey = this.flattenRowKeys[index];
        if (isNil(rowKey))
            return null;
        return this.getRowDataByRowKey(rowKey);
    }
    insertRowState(rowData, meta) {
        const rowKey = this.getRowKey ? this.getRowKey(rowData) : `${meta.deep}-${meta.index}`;
        const newMeta = Object.assign({}, {
            key: rowKey,
            height: this.roughRowHeight,
        }, meta);
        const state = new TableRowState({
            rowData,
            meta: newMeta,
            rowStateCenter: this,
        });
        this.rowStateMap.set(rowKey, state);
        this.rowKeyMap.set(rowData, rowKey);
        return state;
    }
    updateYIndexesByRowKey(rowKey) {
        var _a, _b;
        if (!rowKey) {
            this.updateYIndexesByFlattenIndex();
            return;
        }
        const rowIndex = (_b = (_a = this.getStateByRowKey(rowKey)) === null || _a === void 0 ? void 0 : _a.getMeta().index) !== null && _b !== void 0 ? _b : -1;
        const matchIndex = rowIndex < (this.flattenRowKeys.length / 2)
            ? this.flattenRowKeys.findIndex(_rowKey => _rowKey === rowKey)
            : this.flattenRowKeys.findLastIndex(_rowKey => _rowKey === rowKey);
        this.updateYIndexesByFlattenIndex(matchIndex);
    }
    updateYIndexesByFlattenIndex(index = 0) {
        const flattenIndex = Math.max(index, 0);
        let reduceHeight = this.flattenYIndexes[flattenIndex - 1] || 0;
        const length = this.flattenYIndexes.length;
        for (let i = flattenIndex; i < length - 1; i++) {
            this.flattenYIndexes[i] = reduceHeight + this.getRowHeightByFlattenIndex(i);
            reduceHeight = this.flattenYIndexes[i];
        }
    }
}

function adjustScrollOffset(offset, maxMove) {
    return Math.max(0, Math.min(maxMove, offset));
}
function rowKeyCompare(prev, next) {
    const prevIndex = prev.split("-").map(char => Number(char));
    const nextIndex = next.split("-").map(char => Number(char));
    const maxLength = Math.max(prevIndex.length, nextIndex.length);
    let _compare = 0;
    for (let i = 0; i < maxLength; i++) {
        const prev = prevIndex[i] || -1;
        const next = nextIndex[i] || -1;
        _compare = prev - next;
        if (_compare !== 0) {
            return _compare;
        }
    }
    return _compare;
}

class Viewport {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.scrollWidth = 0;
        this.scrollHeight = 0;
    }
}

const RowHeight = 55;
// 表格的状态类
class TableState {
    constructor(option) {
        var _a;
        this.scroll = { left: 0, top: 0 };
        this.rowOffset = {
            top: 0,
            bottom: 0
        };
        this.hoverState = {
            rowIndex: -1,
            rowKey: -1,
            colKey: ""
        };
        this.childrenColumnName = "children";
        this.expandedRowKeys = [];
        this.viewport = new Viewport();
        this.colStateCenter = new TableColStateCenter({ tableState: this });
        this.rowStateCenter = new TableRowStateCenter({
            tableState: this,
            rowHeight: (_a = option.rowHeight) !== null && _a !== void 0 ? _a : RowHeight,
            getRowKey: option.getRowKey
        });
        this.init(option);
    }
    init(option) {
        var _a, _b, _c, _d;
        this.childrenColumnName = (_a = option.childrenColumnName) !== null && _a !== void 0 ? _a : "children";
        Object.assign(this.viewport, (_b = option.viewport) !== null && _b !== void 0 ? _b : {});
        if ((_c = option.columns) === null || _c === void 0 ? void 0 : _c.length) {
            this.updateColumns(option.columns);
        }
        if ((_d = option.rowDatas) === null || _d === void 0 ? void 0 : _d.length) {
            this.updateRowDatas(option.rowDatas);
        }
    }
    updateColumns(columns) {
        this.colStateCenter.updateColumns(columns);
    }
    updateRowDatas(rowDatas) {
        this.rowStateCenter.updateRowDatas(rowDatas);
    }
    updateRowMetas(rowMetas) {
        const groupedCellMetas = groupBy(rowMetas, "rowKey");
        let offsetHeight = 0;
        let firstRowState = null;
        const rowKeys = Object.keys(groupedCellMetas);
        for (const rowKey of rowKeys) {
            const rowState = this.rowStateCenter.getStateByRowKey(rowKey);
            if (rowState) {
                firstRowState = firstRowState || rowState;
                const fistStateMeta = firstRowState.getMeta();
                const currentStateMeta = rowState.getMeta();
                if (firstRowState.getMeta().deep > currentStateMeta.deep) {
                    firstRowState = rowState;
                }
                else if (fistStateMeta.deep === currentStateMeta.deep && fistStateMeta.index > currentStateMeta.index) {
                    firstRowState = rowState;
                }
                const outerRowMetas = groupedCellMetas[rowKey];
                const rowHeight = Math.max(...outerRowMetas.map(meta => meta.height));
                offsetHeight = offsetHeight + (rowHeight - rowState.getMeta().height);
                rowState.updateHeight(rowHeight);
            }
        }
        if (offsetHeight === 0)
            return;
        if (firstRowState) {
            this.rowStateCenter.updateYIndexesByRowKey(firstRowState.getMeta().key);
        }
        this.viewport.scrollHeight = this.viewport.scrollHeight + offsetHeight;
    }
    updateViewport(width, height) {
        var _a;
        Object.assign((_a = this.viewport) !== null && _a !== void 0 ? _a : {}, { width, height });
    }
    updateScroll() {
        const { scrollHeight, scrollWidth, width, height } = this.viewport;
        const maxXMove = Math.max(0, scrollWidth - width);
        const maxYMove = Math.max(0, scrollHeight - height);
        Object.assign(this.scroll, {
            left: adjustScrollOffset(this.scroll.left, maxXMove),
            top: adjustScrollOffset(this.scroll.top, maxYMove)
        });
    }
    getViewportRowDataRange() {
        const range = { startIndex: 0, endIndex: 0 };
        const _createCompare = (targetY) => {
            return (y) => {
                return targetY - y;
            };
        };
        const { flattenYIndexes, flattenRowKeys } = this.rowStateCenter;
        const dataSourceLength = flattenRowKeys.length;
        range.startIndex = binaryFindIndexRange(flattenYIndexes, _createCompare(this.scroll.top));
        if (range.startIndex === -1) {
            range.startIndex = flattenYIndexes.length - 1;
        }
        const endY = this.scroll.top + this.viewport.height;
        const getY = (index) => {
            var _a;
            const y = (_a = flattenYIndexes[index]) !== null && _a !== void 0 ? _a : (flattenYIndexes[index - 1] + this.rowStateCenter.getRowHeightByRowKey(flattenRowKeys[index]));
            flattenYIndexes[index] = y;
            return y;
        };
        for (let i = range.startIndex; i < flattenRowKeys.length - 1; i++) {
            range.endIndex = i;
            const currntY = getY(i);
            if (endY < currntY) {
                break;
            }
        }
        this.rowStateCenter.flattenYIndexes = flattenYIndexes;
        range.endIndex = Math.max(range.endIndex, 0);
        const buffer = Math.ceil((range.endIndex - range.startIndex + 1) / 2);
        range.startIndex = Math.max(0, range.startIndex - buffer);
        range.endIndex = Math.min(dataSourceLength - 1, range.endIndex + buffer);
        return range;
    }
    _calculateRowOffset(rowIndex) {
        var _a;
        return (_a = this.rowStateCenter.flattenYIndexes[rowIndex]) !== null && _a !== void 0 ? _a : 0;
    }
    // 根据可视索引，更新上下的偏移距离。
    updateRowOffsetByRange(range) {
        const dataSourceLength = this.rowStateCenter.flattenRowKeys.length;
        // 这里计算获取的时候同时计算行偏移量，有点不够干净
        Object.assign(this.rowOffset, {
            top: this._calculateRowOffset(range.startIndex - 1),
            bottom: this._calculateRowOffset(dataSourceLength - 1) - this._calculateRowOffset(range.endIndex)
        });
    }
    // 获取可视范围的数据
    getViewportDataSource() {
        const range = this.getViewportRowDataRange();
        this.updateRowOffsetByRange(range);
        return Array(range.endIndex - range.startIndex + 1).fill(null).reduce((result, _, index) => {
            const rowIndex = range.startIndex + index;
            const rowData = this.rowStateCenter.getRowDataByFlattenIndex(rowIndex);
            if (rowData) {
                result.push(rowData);
            }
            return result;
        }, []);
    }
    getViewportHeightList(viewportDataSource) {
        return viewportDataSource.map(rowData => {
            return this.rowStateCenter.getRowHeightByRowData(rowData);
        });
    }
    isEmpty() {
        return !!this.rowStateCenter.flattenRowKeys.length;
    }
    getRowDataChildren(rowData) {
        return rowData[this.childrenColumnName];
    }
    // 更新展开列
    updateExpandedRowKeys(expandedRowKeys) {
        var _a, _b;
        const rowStateCenter = this.rowStateCenter;
        const sortedExpandedRowKeysByDeep = expandedRowKeys.sort((prev, next) => {
            var _a, _b, _c, _d, _e, _f;
            return ((_c = (_b = (_a = rowStateCenter.getStateByRowKey(prev)) === null || _a === void 0 ? void 0 : _a.getMeta()) === null || _b === void 0 ? void 0 : _b.deep) !== null && _c !== void 0 ? _c : -1) - ((_f = (_e = (_d = rowStateCenter.getStateByRowKey(next)) === null || _d === void 0 ? void 0 : _d.getMeta()) === null || _e === void 0 ? void 0 : _e.deep) !== null && _f !== void 0 ? _f : -1);
        });
        // FIXME: 这里需要重写。
        const expandedRowKeySet = new Set(sortedExpandedRowKeysByDeep);
        const insertedRowKeySet = new Set([]);
        while (expandedRowKeySet.size) {
            const rowKey = Array.from(expandedRowKeySet).find(key => rowStateCenter.getRowDataByRowKey(key));
            if (!isNil(rowKey)) {
                expandedRowKeySet.delete(rowKey);
                const record = rowStateCenter.getRowDataByRowKey(rowKey);
                if (record) {
                    const parentMeta = (_a = rowStateCenter.getStateByRowKey(rowKey)) === null || _a === void 0 ? void 0 : _a.getMeta();
                    const children = (_b = this.getRowDataChildren(record)) !== null && _b !== void 0 ? _b : [];
                    if (children.length) {
                        children.forEach((row, rowIndex) => {
                            const rowState = rowStateCenter.insertRowState(row, {
                                index: rowIndex,
                                deep: parentMeta ? (parentMeta.deep + 1) : 0,
                                _sort: `${parentMeta ? parentMeta._sort : "0"}-${String(rowIndex)}`
                            });
                            insertedRowKeySet.add(rowState.getMeta().key);
                        });
                    }
                }
            }
        }
        // FIXME: 展开和收缩后 y 的变化
        // 最后才更新展开列
        this.expandedRowKeys = expandedRowKeys;
        this.updateFlattenRowKeysByExpandedRowKeys();
    }
    updateFlattenRowKeysByExpandedRowKeys() {
        var _a, _b;
        const rowStateCenter = this.rowStateCenter;
        function _getSort(rowKey) {
            var _a, _b;
            return (_b = (_a = rowStateCenter.getStateByRowKey(rowKey)) === null || _a === void 0 ? void 0 : _a.getMeta()._sort) !== null && _b !== void 0 ? _b : '';
        }
        const sortedExpandedRowKeys = this.expandedRowKeys.sort((prev, next) => {
            return rowKeyCompare(_getSort(prev), _getSort(next));
        });
        const newflattenRowKeys = [];
        let children = [];
        let _rawRowIndex = 0;
        let _expandRowIndedx = 0;
        while (_rawRowIndex < rowStateCenter.rawRowKeys.length || children.length) {
            const childrenTop = children.shift();
            const rowKey = childrenTop
                ? (_a = rowStateCenter.getStateByRowData(childrenTop)) === null || _a === void 0 ? void 0 : _a.getMeta().key
                : rowStateCenter.rawRowKeys[_rawRowIndex];
            if (!childrenTop) {
                _rawRowIndex++;
            }
            if (rowKey === sortedExpandedRowKeys[_expandRowIndedx]) {
                _expandRowIndedx++;
                const rowData = rowStateCenter.getRowDataByRowKey(rowKey);
                if (rowData) {
                    children = ((_b = this.getRowDataChildren(rowData)) !== null && _b !== void 0 ? _b : []).concat(children);
                }
            }
            rowKey && newflattenRowKeys.push(rowKey);
        }
        this.rowStateCenter.flattenRowKeys = newflattenRowKeys;
    }
}

export { ColKeySplitWord, DefaultColWidth, TableColState, TableColStateCenter, TableRowState, TableRowStateCenter, TableState, Viewport };
//# sourceMappingURL=index.esm.js.map
