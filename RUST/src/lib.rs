use std::env::var;
use wasm_bindgen::__rt::flat_byte_slices;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

fn ranged_add(target: u8, value: i8) -> u8 {
    let val = target as i16 + value as i16; // Use i16 to prevent overflow
    if val < 0 {
        0
    } else if val > 255 {
        u8::MAX
    } else {
        val as u8
    }
}

#[wasm_bindgen]
pub fn handle_brightness(data: &mut [u8], value: i8) {
    for chunk in data.chunks_exact_mut(4) {
        chunk[0] = ranged_add(chunk[0], value); // Red
        chunk[1] = ranged_add(chunk[1], value); // Green
        chunk[2] = ranged_add(chunk[2], value); // Blue
    }
}

#[wasm_bindgen]
pub fn handle_rgb(data: &mut [u8], value: i8 ,flag:u8) {
    if flag >= 3 || flag < 0 {return;}
    for chunk in data.chunks_exact_mut(4) {
        chunk[flag] = ranged_add(chunk[flag], value);
    }
}




