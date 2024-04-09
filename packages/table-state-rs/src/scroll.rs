#![allow(dead_code)]

pub struct Scroll {
    left: i32,
    top: i32,
}

impl Scroll {
    pub fn new() -> Scroll {
        return Scroll {
            left: 0,
            top: 0,
        };
    }
}