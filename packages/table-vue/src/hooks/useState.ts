import type { ComputedRef, InjectionKey, Ref } from "vue";
import { computed, inject, provide, ref, shallowRef, watch } from "vue";
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
import { debounce, isNil, isObject, throttle } from "lodash-es";
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

	callback: Record<string, () => void>,
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

		let pagination;
		if (props.pagination) {
			pagination = typeof props.pagination === "boolean"
				? {
					page: 1,
					size: 10,
					total: dataSource?.length ?? 0,
				}
				: {
					page: props.pagination.current ?? 1,
					size: props.pagination.pageSize ?? 10,
					total: props.pagination.total ?? 0
				};
		}

		return new TableState({
			columns: columns ?? [],
			rowDatas: dataSource ?? [],
			getRowKey: getRowKey.value,
			rowHeight: props.rowHeight,
			col_children_name: props.childrenColumnName,
			row_children_name: props.rowChildrenName,
			pagination: pagination
		});
	}

	const state = ref<TableState>(createTableState());

	watch(
		() => props.dataSource ?? [],
		(dataSource) => {
			state.value.update_row_datas(dataSource);
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

	const throttle_update_viewport_content_width = throttle(() => {
		state.value.update_viewport_content_width();
	}, 60)

	// 处理列的宽度调整
	function handleResizeColumn(resizedWidth: number, column: TableColumn) {
		if (!userSelectState.isSet && tableRef.value) {
			userSelectState.pre = tableRef.value.style.userSelect ?? "";
			userSelectState.isSet = true;
			tableRef.value.style.userSelect = "none";
		}

		props.onResizeColumn?.(resizedWidth, column);
		revertTableUserSelect();

		const col_state = state.value.col_state;

		const col_key = col_state.get_col_key_by_column(column);
		if (col_key) {
			col_state.update_col_width_by_col_key(col_key, resizedWidth);
		}

		throttle_update_viewport_content_width();
	}

	// 集中处理 tooltip 的逻辑
	const { handleTooltipEnter, handleTooltipLeave } = useCellTooltip({
		tooltipVisible(cellEl: HTMLElement) {
			const colKey = cellEl.dataset["colKey"] ?? "";
			const column = state.value.col_state.get_column_by_col_key(colKey);

			if (isNil(column)) return false;

			return !!(isObject(column.ellipsis) && column.ellipsis.showTooltip);
		},
	});

	const callback = {
		updateViewportDataSource: () => { },
	}

	// 处理展开逻辑
	const { handleRowExpand, expandedKeys } = useRowExpand({
		tableProps: props,
		getRowKey(record) {
			return (
				state.value.row_state.get_meta_by_row_data(record)?.key ?? -1
			);
		},
		afterHandleRowExpand(expanded, record, expandedRows) {
			// 传递事件
			emit("expand", expanded, record);
			emit("update:expandedRowKeys", expandedRows);
			emit("expandedRowsChange", expandedRows);
			console.time("update_expanded_row_keys")
			state.value.update_expanded_row_keys(expandedRows);
			console.timeEnd("update_expanded_row_keys")
			callback.updateViewportDataSource?.();
		},
	});

	// 向下注入数据
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

		callback
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
		callback: {}
	});
}
