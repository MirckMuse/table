use std::cell::RefCell;
use std::rc::Weak;

use crate::table::InternalTableState;

/// 行状态管理中心
pub struct TableRowStateCenter {
    table_state: Weak<RefCell<InternalTableState>>,

    raw_row_keys: Vec<String>,
}

impl TableRowStateCenter {
    /// 创建行状态中心
    pub fn new(table_state: Weak<RefCell<InternalTableState>>) -> TableRowStateCenter {
        return TableRowStateCenter {
            table_state,
            raw_row_keys: vec![],
        };
    }

    /// 判断当前是否存在行数据
    pub fn is_empty(&self) -> bool { return false; }
}