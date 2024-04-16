#![allow(dead_code)]

use std::array::from_fn;
use crate::viewport::Viewport;

use js_sys::{Function, Object, Reflect};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const TABLE_STATE_OPTION: &'static str = r#"
import type { RowData, GetRowKey, TableColumn } from "@scode/table-typing"

export interface IViewport {
  width: number,

  height: number,

  content_width: number,

  content_height: number,
}
"#;

pub type RowData = Object;

#[wasm_bindgen(skip_typescript)]
pub struct TableColumn {
    key: String,
}

pub type GetRowKey = Function;

// pub fn default_get_row_key(row_data: RowData) -> String {
//     let empty_string = "".to_string();
//     if row_data.is_null() || row_data.is_undefined() {
//         return empty_string;
//     }
//     return match Reflect::get(&row_data, &JsValue::from_str("id")).unwrap() {
//         None => empty_string,
//         Some(value) => value,
//     };
// }
