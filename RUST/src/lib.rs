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

fn adjust_channels(data: &mut [u8], red_value: i8, green_value: i8, blue_value: i8) {
    for chunk in data.chunks_exact_mut(4) {
        chunk[0] = ranged_add(chunk[0], red_value);
        chunk[1] = ranged_add(chunk[1], green_value);
        chunk[2] = ranged_add(chunk[2], blue_value);
    }
}

#[wasm_bindgen]
pub fn handle_brightness(data: &mut [u8], value: i8) {
    adjust_channels(data, value, value, value);
}

#[wasm_bindgen]
pub fn handle_rgb(data: &mut [u8], red_value: i8, green_value: i8, blue_value: i8) {
    adjust_channels(data, red_value, green_value, blue_value);
}



fn adjust_contrast(value: u8, contrast_factor: f32) -> u8 {
    let midpoint = 128.0;
    let new_value = midpoint + (value as f32 - midpoint) * contrast_factor;
    new_value.clamp(0.0, 255.0) as u8
}

#[wasm_bindgen]
pub fn handle_contrast(data: &mut [u8], contrast: i32) {
    let contrast_factor = (259.0 * (contrast as f32 + 255.0)) / (255.0 * (259.0 - contrast as f32));

    for chunk in data.chunks_exact_mut(4) {
        chunk[0] = adjust_contrast(chunk[0], contrast_factor);
        chunk[1] = adjust_contrast(chunk[1], contrast_factor);
        chunk[2] = adjust_contrast(chunk[2], contrast_factor);
    }
}

#[wasm_bindgen]
pub fn update_img(data: &mut [u8] , brightness:i8, contrast:i32 ,red:i8, green:i8, blue:i8 ) {
    handle_rgb(data,red,green,blue);
    handle_brightness(data, brightness);
    handle_contrast(data, contrast);
}
