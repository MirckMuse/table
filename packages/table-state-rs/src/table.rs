#![allow(dead_code)]

use std::cell::RefCell;
use std::rc::Rc;
use std::ops::{Deref, DerefMut};
use wasm_bindgen::prelude::*;

use crate::col::*;
use crate::row::*;
use crate::scroll::Scroll;
use crate::viewport::{Viewport, VirtualOffset};

/// 滚动距离
#[wasm_bindgen]
/// table 状态
pub struct TableState {
    internal_table_state: Rc<RefCell<InternalTableState>>,
}

pub struct InternalTableState {
    viewport: Viewport,

    pub scroll: Scroll,

    virtual_offset: VirtualOffset,

    // get_row_key: Box<GetRowKey>,

    col_state_center: Option<Rc<TableColStateCenter>>,

    row_state_center: Option<Rc<TableRowStateCenter>>,
}

#[wasm_bindgen]
impl TableState {
    /// 创建 TableState 的 工厂方法
    pub fn new() -> TableState {
        let table_state = Rc::new(RefCell::new(InternalTableState {
            viewport: Viewport::new(),
            scroll: Scroll::new(),
            virtual_offset: VirtualOffset::new(),
            // get_row_key: option.get_row_key.unwrap_or(default_get_row_key),

            // 列状态控制器
            col_state_center: None,
            // 行状态控制器
            row_state_center: None,
        }));


        let col_state_center = Rc::new(TableColStateCenter::new(Rc::downgrade(&table_state)));
        let row_state_center = Rc::new(TableRowStateCenter::new(Rc::downgrade(&table_state)));
        table_state.borrow_mut().col_state_center = Some(col_state_center);
        table_state.borrow_mut().row_state_center = Some(row_state_center);

        return TableState {
            internal_table_state: table_state
        };
    }

    /// 初始化行状态控制器
    pub fn init_row_state_center(&self) {}

    /// 初始化列状态控制器
    fn init_col_state_center(&self) {}
}
