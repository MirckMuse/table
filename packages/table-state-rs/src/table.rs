#![allow(dead_code)]

use wasm_bindgen::prelude::*;

use crate::viewport::{Viewport, VirtualOffset};
use crate::scroll::{Scroll};
use crate::interface::*;
use crate::col::*;
use crate::row::*;

/// 滚动距离
#[wasm_bindgen]
/// table 状态
pub struct TableState {

    viewport: Viewport,

    scroll: Scroll,

    virtual_offset: VirtualOffset,

    get_row_key: Box<GetRowKey>,

    col_state_center: TableColStateCenter,

    row_state_center: TableRowStateCenter,
}

#[wasm_bindgen]
impl TableState {
    /// 创建 TableState 的 工厂方法
    pub fn new(option: TableStateOption) -> TableState {
        let state = TableState {
            viewport: option.viewport.unwrap_or(Viewport::new()),
            scroll: Scroll::new(),
            virtual_offset: VirtualOffset::new(),
            get_row_key: option.get_row_key.unwrap_or(default_get_row_key),

            // 列状态控制器
            col_state_center: TableColStateCenter::new(),
            // 行状态控制器
            row_state_center: TableRowStateCenter::new(),
        };

        return state;
    }

    /// 初始化行状态控制器
    fn init_row_state_center(&self) {}

    /// 初始化列状态控制器
    fn init_col_state_center(&self) {}
}

#[wasm_bindgen]
impl TableState {
    fn init(&self) {
        self.init_col_state_center();
    }
}