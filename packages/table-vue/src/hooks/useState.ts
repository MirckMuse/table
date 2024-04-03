import type { ComputedRef, InjectionKey, Ref } from "vue";
import { computed, inject, provide, ref, watch } from "vue";
import type {
	GetRowKey,
	RowData,
	RowKey,
	TableColumn,
} from "@scode/table-typing";
import type {
	InteralTableSlot,
	TableEmit,
	TableProps,
	TableSlot,
} from "../typing";
import { debounce, isNil, isObject } from "lodash-es";
import { getDFSLastColumns, noop } from "../utils/shared";
import { useCellTooltip } from "./useCellTooltip";
import { TableState } from "@scode/table-state";

interface ITableContext {
	tableState: Ref<TableState>;

	tableProps: TableProps;

	slots: InteralTableSlot;

	getRowKey: ComputedRef<GetRowKey | undefined>;

	handleResizeColumn: (resizedWidth: number, column: TableColumn) => void;

	// cell 的移入和移出逻辑
	handleTooltipEnter: (cellEl: HTMLElement) => void;
	handleTooltipLeave: ($event: MouseEvent) => void;

	// 展开事件
	handleRowExpand: (event: Event, record: RowData) => void;

	expandedKeys: ComputedRef<Set<RowKey>>;
}

const TableStateKey: InjectionKey<ITableContext> = Symbol("__TableState__");

interface IStateOption {
	props: TableProps;

	slots: TableSlot;

	emit: TableEmit;

	tableRef: Ref<HTMLElement | undefined>;
}

export interface IRowExpandOption {
	tableProps: TableProps;

	getRowKey: (record: RowData) => RowKey;

	beforeHandleRowExpand?: ($event: Event, record: RowData) => void;

	/**
	 *  展开之后的回调函数，组件内部是做 emit 的事件传递。
	 *  通过接受传递的函数来让用户可以做一些定制化的操作。
	 * @param expanded
	 * @param record
	 * @param expandedRows
	 * @returns
	 */
	afterHandleRowExpand?: (
		expanded: boolean,
		record: RowData,
		expandedRows: RowKey[],
	) => void;
}

// 展开事件的相关逻辑
export function useRowExpand(option: IRowExpandOption) {
	const { tableProps, beforeHandleRowExpand, afterHandleRowExpand, getRowKey } =
		option;

	const internalExpandedKeys = ref<RowKey[]>([]);

	// 整合之后的 expandedKeys
	const mergedExpandedKeys = computed(
		() =>
			new Set(tableProps.expandedRowKeys || internalExpandedKeys.value || []),
	);

	function handleRowExpand($event: Event, record: RowData) {
		beforeHandleRowExpand?.($event, record);

		const rowKey = getRowKey(record);
		const expanded = !mergedExpandedKeys.value.has(rowKey);

		const rowKeySet = mergedExpandedKeys.value;
		if (expanded) {
			rowKeySet.add(rowKey);
		} else {
			rowKeySet.delete(rowKey);
		}
		internalExpandedKeys.value = [...rowKeySet];

		afterHandleRowExpand?.(expanded, record, internalExpandedKeys.value);
	}

	return {
		expandedKeys: mergedExpandedKeys,
		handleRowExpand,
	};
}

export function useStateProvide({
	props,
	slots,
	emit,
	tableRef,
}: IStateOption) {
	const interalSlots = Object.assign({}, slots ?? {}) as InteralTableSlot;

	const getRowKey = computed(() => {
		const rowKey = props.rowKey;

		if (!rowKey) return;

		if (typeof rowKey === "function") return rowKey;

		return (record: RowData) => record[rowKey] as RowKey;
	});

	function createTableState() {
		const { columns, dataSource, childrenColumnName } = props;

		const lastColumn: TableColumn[] = getDFSLastColumns(columns ?? []);

		if (!lastColumn.some((col) => col.expandable)) {
			lastColumn[0].expandable = true;
		}

		return new TableState({
			columns: columns ?? [],
			rowDatas: dataSource ?? [],
			getRowKey: getRowKey.value,
			rowHeight: props.rowHeight,
			childrenColumnName: childrenColumnName,
		});
	}

	const state = ref<TableState>(createTableState());

	watch(
		() => props.dataSource ?? [],
		(dataSource) => {
			state.value.updateRowDatas(dataSource);
		},
	);


	let userSelectState = {
		pre: "",
		isSet: false,
	};
	const revertTableUserSelect = debounce(() => {
		userSelectState.isSet = false;
		if (!tableRef.value) return;
		tableRef.value.style.userSelect = userSelectState.pre;
	}, 60);

	function handleResizeColumn(resizedWidth: number, column: TableColumn) {
		if (!userSelectState.isSet && tableRef.value) {
			userSelectState.pre = tableRef.value.style.userSelect ?? "";
			userSelectState.isSet = true;
			tableRef.value.style.userSelect = "none";
		}

		props.onResizeColumn?.(resizedWidth, column);
		revertTableUserSelect();
	}

	const { handleTooltipEnter, handleTooltipLeave } = useCellTooltip({
		tooltipVisible(cellEl: HTMLElement) {
			const colKey = cellEl.dataset["colKey"] ?? "";
			const column = state.value.colStateCenter.getColumnByColKey(colKey);

			if (isNil(column)) return false;

			return !!(isObject(column.ellipsis) && column.ellipsis.showTooltip);
		},
	});

	const { handleRowExpand, expandedKeys } = useRowExpand({
		tableProps: props,
		getRowKey(record) {
			return (
				state.value.rowStateCenter.getStateByRowData(record)?.getMeta().key ??
				-1
			);
		},
		afterHandleRowExpand(expanded, record, expandedRows) {
			// 传递事件
			emit("expand", expanded, record);
			emit("update:expandedRowKeys", expandedRows);
			emit("expandedRowsChange", expandedRows);
			state.value.updateExpandedRowKeys(expandedRows);
		},
	});

	provide(TableStateKey, {
		tableState: state as Ref<TableState>,
		slots: interalSlots,
		tableProps: props,
		getRowKey,

		handleResizeColumn,

		handleTooltipEnter,
		handleTooltipLeave,

		expandedKeys,
		handleRowExpand,
	});
}

export function useStateInject() {
	return inject(TableStateKey, {
		tableState: ref(),
		slots: {} as InteralTableSlot,
		tableProps: {},
		getRowKey: computed(
			() =>
				function () {
					return "";
				},
		),

		handleResizeColumn: noop,

		handleTooltipEnter: noop,
		handleTooltipLeave: noop,

		expandedKeys: computed(() => new Set<RowKey>()),
		handleRowExpand: noop,
	});
}
