#![allow(dead_code)]

use std::option;
use js_sys::Function;
use wasm_bindgen::prelude::*;

use crate::viewport::{Viewport, VirtualOffset};
use crate::scroll::{Scroll};
use crate::interface::*;
use crate::col::*;

/// 滚动距离
#[wasm_bindgen]
/// table 状态
pub struct TableState {
    viewport: Viewport,

    scroll: Scroll,

    virtual_offset: VirtualOffset,

    get_row_key: Box<GetRowKey>,

    col_state_center: TableColStateCenter,
}

#[wasm_bindgen]
impl TableState {
    /// 创建 TableState 的 工厂方法
    pub fn new(option: TableStateOption) -> TableState {
        let state = TableState {
            viewport: option.viewport.unwrap_or(Viewport::new()),
            scroll: Scroll::new(),
            virtual_offset: VirtualOffset::new(),
            get_row_key: option.get_row_key.unwrap_or(default_get_row_key as Function),

            col_state_center: TableColStateCenter::new(),
        };

        return state;
    }
}

#[wasm_bindgen]
impl TableState {
    fn init(&self) {
        self.init_col_state_center();
    }
}