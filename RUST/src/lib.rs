use wasm_bindgen::__rt::flat_byte_slices;
use wasm_bindgen::prelude::*;
use std::io::Cursor;
use image::ImageReader;

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

struct Pixel {
    r: u8,
    g: u8,
    b: u8,
    alpha: u8,
}
impl Pixel {
    fn new(r:u8, g:u8, b:u8, alpha:u8) -> Pixel {
        Pixel { r, g, b, alpha }
    }
    fn clone (&self) -> Pixel {
        Pixel::new(self.r, self.g, self.b, self.alpha)
    }
}
#[wasm_bindgen]
pub fn rotate_right(data: &mut [u8], width: usize) {
    let height = data.len() / (4 * width);
    let mut pixels: Vec<Pixel> = Vec::with_capacity(data.len() / 4);
    // Step 1: Create a pixel array
    for chunk in data.chunks_exact(4) {
        let pixel = Pixel {
            r: chunk[0],
            g: chunk[1],
            b: chunk[2],
            alpha: chunk[3],
        };
        pixels.push(pixel);
    }
    // Step 2: Create a temporary array for column-wise rotation
    let mut temp: Vec<Pixel> = Vec::with_capacity(pixels.len());
    for col in 0..width {
        for row in (0..height).rev() {
            temp.push(pixels[row * width + col].clone());
        }
    }
    // Step 3: Flatten the temp array back into the original data
    for (i, pixel) in temp.iter().enumerate() {
        let base = i * 4;
        data[base] = pixel.r;
        data[base + 1] = pixel.g;
        data[base + 2] = pixel.b;
        data[base + 3] = pixel.alpha;
    }
}

#[wasm_bindgen]
pub fn greyscale(data: &mut [u8]) {
    for pixel in data.chunks_exact_mut(4) {
        let avg:u8  =((pixel[0] as f32 * 0.299 ) +
                     (pixel[1] as f32 * 0.587 ) +
                     (pixel[2] as f32 * 0.114) ) as u8;
        pixel[0] = avg;
        pixel[1] = avg;
        pixel[2] = avg;
    }
}

#[wasm_bindgen]
pub fn sepia(data: &mut [u8]) {
    for pixel in data.chunks_exact_mut(4) {
        let r = pixel[0] as f64;
        let g = pixel[1] as f64;
        let b = pixel[2] as f64;
        pixel[0] = (0.393 * r + 0.769 * g + 0.189 * b) as u8;
        pixel[1] = (0.349 * r + 0.686 * g + 0.168 * b) as u8;
        pixel[2] = (0.272 * r + 0.534 * g + 0.131 * b) as u8;
    }
}

#[wasm_bindgen]
pub fn invert(data: &mut [u8]) {
    for pixel in data.chunks_exact_mut(4) {
        pixel[0] = 255 - pixel[0];
        pixel[1] = 255 - pixel[1];
        pixel[2] = 255 - pixel[2];
    }
}

#[wasm_bindgen]
pub 