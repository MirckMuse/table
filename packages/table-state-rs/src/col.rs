#![allow(dead_code)]

use std::cell::RefCell;
use std::rc::Weak;
use std::task::Wake;
use crate::interface::TableColumn;
use crate::table::InternalTableState;
use crate::unit::Unit;

pub type ColKey = String;

#[derive(Clone)]
/// 列的元信息
pub struct ColMeta {
    /// 列生成的 key
    key: ColKey,

    /// 列的宽度
    width: Unit,

    /// 列的深度，
    deep: u32,

    /// 列占多少列
    col_span: u32,

    /// 列占多少行
    row_span: u32,

    /// 是否是叶子节点
    is_leaf: bool,
}


/// 列状态
pub struct TableColState {
    pub column: TableColumn,

    pub col_state_center: TableColStateCenter,

    pub meta: ColMeta,
}

impl TableColState {
    /// 获取 meta
    pub fn get_meta(&self) -> ColMeta {
        return self.meta.clone();
    }

    /// 更新列宽
    pub fn update_col_width(&mut self, width: u32) {
        self.meta.width.update_from_pixel(width);
    }

    pub fn new(center: TableColStateCenter, column: TableColumn, meta: ColMeta) -> TableColState {
        return TableColState {
            col_state_center: center,
            column,
            meta,
        };
    }
}


pub struct TableColStateCenter {
    columns: Weak<Vec<TableColumn>>,

    table_state: Weak<RefCell<InternalTableState>>,
}

impl TableColStateCenter {
    pub fn new(table_state: Weak<RefCell<InternalTableState>>) -> TableColStateCenter {
        return TableColStateCenter {
            columns: Weak::new(),

            table_state,
        };
    }
}
