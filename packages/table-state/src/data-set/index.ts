import type { FilterState, RowData, SorterState } from "@scode/table-typing";

export class TableDataSet {

  private displayData: RowData[];

  // 获取显示的数据集
  getDisplayDataSet(): RowData[] {
    return this.displayData || [];
  }

  // 处理显示的数据集，展开、排序、筛选、远程的数据执行该函数
  processDisplayDataSet(expand_keys: RowData[], filter_state: FilterState, sorter_state: SorterState) {
  }
}