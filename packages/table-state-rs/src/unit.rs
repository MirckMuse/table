use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
/// 单位
pub enum UnitType {
    REM,
    PIXEL,
}

impl Default for UnitType {
    fn default() -> Self {
        return UnitType::PIXEL;
    }
}

#[wasm_bindgen]
pub struct Unit {
    unit_type: UnitType,

    root: Option<u32>,

    value: u32,
}

impl Clone for Unit {
    fn clone(&self) -> u32 {
        return self.convert_to_pixel();
    }
}

#[wasm_bindgen]
impl Unit {
    pub fn new_pixel(pixel: u32) -> Unit {
        return Unit {
            unit_type: UnitType::PIXEL,
            root: None,
            value: pixel,
        };
    }

    pub fn new_rem(rem: u32, root: u32) -> Unit {
        return Unit {
            unit_type: UnitType::REM,
            root: Some(root),
            value: rem,
        };
    }

    pub fn create(unit: String, root: Option<u32>) -> Unit {
        let root = root.unwrap_or(1);

        return if unit.ends_with("rem") {
            Self::new_rem(
                unit.replace("rem", "").parse::<u32>().unwrap(),
                root,
            )
        } else {
            Unit::new_pixel(unit.parse::<u32>().unwrap())
        };
    }

    /// 根据单位类型转换成像素格式。
    pub fn convert_to_pixel(&self) -> u32 {
        return match self.unit_type {
            UnitType::REM => {
                self.value * self.root.unwrap_or(1)
            }
            UnitType::PIXEL => {
                self.value
            }
        };
    }

    /// 将外部传递来的像素转换成内部属性。
    pub fn update_from_pixel(&mut self, pixel: u32) {
        match self.unit_type {
            UnitType::REM => {
                self.value = pixel / self.root.unwrap_or(1);
            }
            UnitType::PIXEL => {
                self.value = pixel;
            }
        }
    }
}
