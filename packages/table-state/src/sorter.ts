import { RowDataMeta, SorterState, TableColumn } from "@scode/table-typing";
import { SorterDirection } from "@scode/table-typing"
import { get, isNil, memoize } from "lodash-es";

type TableColumnOrNull = TableColumn | null;

type SorterStateWithColumn = SorterState & { column: TableColumnOrNull };

enum CompareResult {
  Less = -1,
  Equal = 0,
  Greater = 1,
}

interface TableSorterStateOption {
  get_column_by_sorter_state: (sorter_state: SorterState) => TableColumnOrNull,
}

export class TableSorterState {
  get_column_by_sorter_state: (sorter_state: SorterState) => TableColumnOrNull;

  get_sorter_rate = memoize((direction?: SorterDirection) => {
    if (direction === SorterDirection.Ascend) {
      return 1;
    }
    if (direction === SorterDirection.Descend) {
      return -1;
    }

    return 0;
  })

  constructor(option: TableSorterStateOption) {
    this.get_column_by_sorter_state = option.get_column_by_sorter_state;
  }

  get_sorted_row_data_metas(row_data_metas: RowDataMeta[], sorter_states: SorterState[]): RowDataMeta[] {
    const new_sorter_states = sorter_states.map(state => {
      return Object.assign({}, state, { column: this.get_column_by_sorter_state(state) })
    });

    let time = 0;

    const result = row_data_metas.sort((prev, next) => {
      for (const state of new_sorter_states) {
        const start = performance.now();
        const compareResult = this.get_sorter(state, prev, next);
        time = time + (performance.now() - start);

        if (compareResult !== CompareResult.Equal) {
          return compareResult;
        }
      }

      return CompareResult.Equal;
    });

    console.log('get_sorter: ', time)

    return result;
  }

  private get_sorter(sorter_state: SorterStateWithColumn, prev: RowDataMeta, next: RowDataMeta): CompareResult {
    const { col_key, direction } = sorter_state;

    if (!direction || !col_key) {
      return CompareResult.Equal;
    }

    // 排序系数
    const rate = this.get_sorter_rate(sorter_state.direction);

    return this.order_by(sorter_state.column, prev, next) * rate;
  }

  private order_by(column: TableColumnOrNull, prev: RowDataMeta, next: RowDataMeta) {
    if (!column || !column.dataIndex) return CompareResult.Equal;

    const prevRowDataValue = get(prev.data, column.dataIndex);
    const nextRowDataValue = get(next.data, column.dataIndex);

    return this.memoize_order_by(prevRowDataValue, nextRowDataValue);
  }

  private memoize_order_by = memoize(
    (prev_value: unknown, next_value: unknown) => {
      // 空之间的相互对比
      if (isNil(prev_value) && isNil(next_value)) {
        return CompareResult.Equal;
      }

      if (isNil(prev_value) && !isNil(next_value)) {
        return CompareResult.Greater;
      }

      if (!isNil(prev_value) && isNil(next_value)) {
        return CompareResult.Less;
      }


      if (prev_value === next_value) return CompareResult.Equal;
      // number string 之间的相互对比
      if (
        typeof prev_value === "number" &&
        typeof next_value === "number"
      ) {
        return prev_value - next_value;
      }

      if (
        typeof prev_value === "string" &&
        typeof next_value === "string"
      ) {
        return prev_value > next_value
          ? CompareResult.Greater
          : CompareResult.Less;
      }

      if (typeof prev_value === "number" && typeof next_value === "string") {
        return CompareResult.Greater;
      }

      if (typeof prev_value === "string" && typeof next_value === "number") {
        return CompareResult.Less;
      }

      // 其他之间的数据类型对比，则直接判定为相等。
      return CompareResult.Equal;
    },
    (prev_value: unknown, next_value: unknown) => `${prev_value}__&valueof&__${next_value}`
  )

}