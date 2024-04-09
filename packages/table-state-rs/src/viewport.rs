#![allow(dead_code)]

use wasm_bindgen::prelude::*;

#[wasm_bindgen(skip_typescript)]
#[derive(Copy, Clone)]
/// 可视窗口
pub struct Viewport {
    width: i32,

    height: i32,

    content_width: i32,

    content_height: i32,
}

impl Viewport {
    pub fn new() -> Viewport {
        return Viewport {
            width: 0,
            height: 0,
            content_width: 0,
            content_height: 0,
        };
    }
}

/// 虚拟偏移量
pub struct VirtualOffset {
    top: i32,

    right: i32,

    bottom: i32,

    left: i32,
}

impl VirtualOffset {
    pub fn new() -> VirtualOffset {
        return VirtualOffset {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
    }
}
