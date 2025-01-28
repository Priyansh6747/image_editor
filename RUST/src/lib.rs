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

#[derive(Clone)]
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
    fn Clone (&self) -> Pixel {
        Pixel::new(self.r, self.g, self.b, self.alpha)
    }
}
fn get_pixels(data: &mut [u8]) -> Vec<Pixel> {
    let mut pixels: Vec<Pixel> = Vec::with_capacity(data.len() / 4);
    for chunk in data.chunks_exact(4) {
        let pixel = Pixel {
            r: chunk[0],
            g: chunk[1],
            b: chunk[2],
            alpha: chunk[3],
        };
        pixels.push(pixel);
    }
    pixels
}
fn get_raw(pixels:&Vec<Pixel>) -> Vec<u8> {
    let mut result:Vec<u8> = vec![];
    for pixel in pixels.iter() {
        result.push(pixel.r);
        result.push(pixel.g);
        result.push(pixel.b);
        result.push(pixel.alpha);
    }
    result
}
#[wasm_bindgen]
pub fn rotate_right(data: &mut [u8], width: usize) {
    let height = data.len() / (4 * width);
    let mut pixels = get_pixels(data);
    let mut temp: Vec<Pixel> = Vec::with_capacity(pixels.len());
    for col in 0..width {
        for row in (0..height).rev() {
            temp.push(pixels[row * width + col].Clone());
        }
    }
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
pub fn blur_image(data: &mut [u8], image_width: usize, blur_radius: usize) {
    let pixels = get_pixels(data);
    let image_height = pixels.len() / image_width;
    let mut pixel_grid = vec![vec![Pixel::new(0, 0, 0, 0); image_width]; image_height];
    for (index, pixel) in pixels.into_iter().enumerate() {
        let row = index / image_width;
        let col = index % image_width;
        pixel_grid[row][col] = pixel;
    }
    let mut blurred_pixels = vec![vec![Pixel::new(0, 0, 0, 0); image_width]; image_height];

    for row in 0..image_height {
        for col in 0..image_width {
            let mut r_sum = 0u32;
            let mut g_sum = 0u32;
            let mut b_sum = 0u32;
            let mut alpha_sum = 0u32;
            let mut valid_neighbors = 0;
            for d_row in -(blur_radius as isize)..=(blur_radius as isize) {
                for d_col in -(blur_radius as isize)..=(blur_radius as isize) {
                    let neighbor_row = row as isize + d_row;
                    let neighbor_col = col as isize + d_col;
                    if neighbor_row >= 0
                        && (neighbor_row as usize) < image_height
                        && neighbor_col >= 0
                        && (neighbor_col as usize) < image_width
                    {
                        let neighbor = &pixel_grid[neighbor_row as usize][neighbor_col as usize];
                        r_sum += neighbor.r as u32;
                        g_sum += neighbor.g as u32;
                        b_sum += neighbor.b as u32;
                        alpha_sum += neighbor.alpha as u32;
                        valid_neighbors += 1;
                    }
                }
            }
            blurred_pixels[row][col] = Pixel::new(
                (r_sum / valid_neighbors) as u8,
                (g_sum / valid_neighbors) as u8,
                (b_sum / valid_neighbors) as u8,
                (alpha_sum / valid_neighbors) as u8,
            );
        }
    }

    let mut flattened_pixels = Vec::with_capacity(data.len());
    for row in 0..image_height {
        for col in 0..image_width {
            let pixel = &blurred_pixels[row][col];
            flattened_pixels.extend_from_slice(&[pixel.r, pixel.g, pixel.b, pixel.alpha]);
        }
    }
    data.copy_from_slice(&flattened_pixels);
}
#[wasm_bindgen]
pub fn sharpen_image(data: &mut [u8], image_width: usize, sharpen_amount: f32) {
    let pixels = get_pixels(data);
    let image_height = pixels.len() / image_width;

    let mut pixel_grid = vec![vec![Pixel::new(0, 0, 0, 0); image_width]; image_height];
    for (index, pixel) in pixels.into_iter().enumerate() {
        let row = index / image_width;
        let col = index % image_width;
        pixel_grid[row][col] = pixel;
    }

    let mut sharpened_pixels = vec![vec![Pixel::new(0, 0, 0, 0); image_width]; image_height];

    for row in 0..image_height {
        for col in 0..image_width {
            let mut r_sum = 0i32;
            let mut g_sum = 0i32;
            let mut b_sum = 0i32;

            for d_row in -1..=1 {
                for d_col in -1..=1 {
                    let neighbor_row = row as isize + d_row;
                    let neighbor_col = col as isize + d_col;

                    if neighbor_row >= 0
                        && (neighbor_row as usize) < image_height
                        && neighbor_col >= 0
                        && (neighbor_col as usize) < image_width
                    {
                        let weight = match (d_row, d_col) {
                            (0, 0) => 5,
                            _ => -1,
                        };
                        let neighbor = &pixel_grid[neighbor_row as usize][neighbor_col as usize];
                        r_sum += neighbor.r as i32 * weight;
                        g_sum += neighbor.g as i32 * weight;
                        b_sum += neighbor.b as i32 * weight;
                    }
                }
            }

            let clamp = |val: i32| val.clamp(0, 255) as u8;
            sharpened_pixels[row][col] = Pixel::new(
                clamp((r_sum as f32 * sharpen_amount) as i32),
                clamp((g_sum as f32 * sharpen_amount) as i32),
                clamp((b_sum as f32 * sharpen_amount) as i32),
                pixel_grid[row][col].alpha,
            );
        }
    }

    let mut flattened_pixels = Vec::with_capacity(data.len());
    for row in 0..image_height {
        for col in 0..image_width {
            let pixel = &sharpened_pixels[row][col];
            flattened_pixels.extend_from_slice(&[pixel.r, pixel.g, pixel.b, pixel.alpha]);
        }
    }
    data.copy_from_slice(&flattened_pixels);
}

fn vintage(pixels: &mut Vec<Pixel>) {
    for pixel in pixels.iter_mut() {
        let r = (pixel.r as f32 * 0.9) as u8;
        let g = (pixel.g as f32 * 0.75) as u8;
        let b = (pixel.b as f32 * 0.5) as u8;
        pixel.r = r;
        pixel.g = g;
        pixel.b = b;
    }
}
fn color_pop(pixels: &mut Vec<Pixel>) {
    for pixel in pixels.iter_mut() {
        let r = (pixel.r as f32 * 1.2).min(255.0) as u8;
        let g = (pixel.g as f32 * 1.2).min(255.0) as u8;
        let b = (pixel.b as f32 * 1.2).min(255.0) as u8;

        pixel.r = r;
        pixel.g = g;
        pixel.b = b;
    }
}
fn vignette(pixels: &mut Vec<Pixel>, width: usize, height: usize) {
    let center_x = width as f32 / 2.0;
    let center_y = height as f32 / 2.0;
    let max_distance = ((center_x * center_x) + (center_y * center_y)).sqrt();

    for (index, pixel) in pixels.iter_mut().enumerate() {
        let x = (index % width) as f32;
        let y = (index / width) as f32;
        let distance = ((x - center_x).powi(2) + (y - center_y).powi(2)).sqrt();
        let factor = (1.0 - (distance / max_distance)).max(0.2);
        pixel.r = (pixel.r as f32 * factor) as u8;
        pixel.g = (pixel.g as f32 * factor) as u8;
        pixel.b = (pixel.b as f32 * factor) as u8;
    }
}

#[wasm_bindgen]
pub fn apply_vignette(data :&mut [u8], width: usize, height: usize) {
    let mut pixels = get_pixels(data);
    vignette(&mut pixels, width, height);
    data.copy_from_slice(&*get_raw(&pixels));
}

#[wasm_bindgen]
pub fn apply_color_pop(data:&mut [u8]) {
    let mut pixels = get_pixels(data);
    color_pop(&mut pixels);
    data.copy_from_slice(&*get_raw(&pixels));
}

#[wasm_bindgen]
pub fn apply_vintage(data:&mut [u8]) {
    let mut pixels = get_pixels(data);
    vintage(&mut pixels);
    data.copy_from_slice(&*get_raw(&pixels));
}