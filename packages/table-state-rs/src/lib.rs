pub mod table;

pub mod interface;

pub mod viewport;

pub mod scroll;

pub mod helper;

mod col;

mod row;

mod unit;

use std::fmt::Pointer;
use wasm_bindgen::prelude::*;


// TODO: 需要研究怎么获得 JsValue 的值。

#[wasm_bindgen]
pub fn get_name(obj: &JsValue) {
    return obj.is_object()
}

