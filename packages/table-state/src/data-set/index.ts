import { RowData } from "@scode/table-typing";
import { TableState } from "../table";

export interface TableDataSetOption {
  table: TableState,
}

export class TableDataSet {

  private table: TableState;

  private displayData: RowData[];

  constructor(option: TableDataSetOption) {
    this.table = option.table;
  }

  // 获取显示的数据集
  getDisplayDataSet(): RowData[] {
    return this.displayData || [];
  }

  // 处理显示的数据集，展开、排序、筛选、远程的数据执行该函数
  processDisplayDataSet() {

  }
}