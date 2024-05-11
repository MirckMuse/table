export interface ITablePagination {
  page: number;
  size: number;
  total: number;
}

// 需要考虑到分页后Y的计算，是放到这里算还是放到table_state算呢？？
export class TablePagination implements ITablePagination {
  // 当前页数
  page: number = 1;
  // 每页条数
  size: number = 10;
  // 行数据总数：合并得来的，
  //  如果是后端分页，则取table组件传入的total，
  //  如果是前端分页，则取table组件传入的rowDatas.length
  total: number = 0;

  constructor(
    page: number,
    size: number,
    total: number,
  ) {
    this.update(page, size, total);
  }

  update(page: number, size: number, total: number) {
    this.page = page;
    this.size = size;
    this.total = total;
  }

  update_page(page: number) {
    this.page = page;
  }

  update_size(size: number) {
    this.size = size;
  }

  update_total(total: number) {
    this.total = total;
  }
}