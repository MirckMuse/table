#![allow(dead_code)]

use crate::interface::TableColumn;
use crate::table::TableState;
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
pub struct TableColState<'center, 'column> {
    pub column: &'column TableColumn,

    pub col_state_center: &'center TableColStateCenter,

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

    pub fn new<'center, 'column>(center: &'center TableColStateCenter, column: &'column TableColumn, meta: ColMeta) -> TableColState {
        return TableColState {
            col_state_center: center,
            column,
            meta,
        };
    }
}


pub struct TableColStateCenter {
    columns: Vec<TableColumn>,
}

impl TableColStateCenter {
    pub fn new() -> TableColStateCenter {
        return TableColStateCenter {
            columns: vec![],
        };
    }
}
