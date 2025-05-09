/* tslint:disable */
/* eslint-disable */
export function handle_brightness(data: Uint8Array, value: number): void;
export function handle_rgb(data: Uint8Array, red_value: number, green_value: number, blue_value: number): void;
export function handle_contrast(data: Uint8Array, contrast: number): void;
export function update_img(data: Uint8Array, brightness: number, contrast: number, red: number, green: number, blue: number): void;
export function rotate_right(data: Uint8Array, width: number): void;
export function greyscale(data: Uint8Array): void;
export function sepia(data: Uint8Array): void;
export function invert(data: Uint8Array): void;
export function blur_image(data: Uint8Array, image_width: number, blur_radius: number): void;
export function sharpen_image(data: Uint8Array, image_width: number, sharpen_amount: number): void;
export function apply_vignette(data: Uint8Array, width: number, height: number): void;
export function apply_color_pop(data: Uint8Array): void;
export function apply_vintage(data: Uint8Array): void;
export function apply_crop(data: Uint8Array, width: number, height: number, given_x: number, given_y: number, image_width: number, image_height: number): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly handle_brightness: (a: number, b: number, c: any, d: number) => void;
  readonly handle_rgb: (a: number, b: number, c: any, d: number, e: number, f: number) => void;
  readonly handle_contrast: (a: number, b: number, c: any, d: number) => void;
  readonly update_img: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: number) => void;
  readonly rotate_right: (a: number, b: number, c: any, d: number) => void;
  readonly greyscale: (a: number, b: number, c: any) => void;
  readonly sepia: (a: number, b: number, c: any) => void;
  readonly invert: (a: number, b: number, c: any) => void;
  readonly blur_image: (a: number, b: number, c: any, d: number, e: number) => void;
  readonly sharpen_image: (a: number, b: number, c: any, d: number, e: number) => void;
  readonly apply_vignette: (a: number, b: number, c: any, d: number, e: number) => void;
  readonly apply_color_pop: (a: number, b: number, c: any) => void;
  readonly apply_vintage: (a: number, b: number, c: any) => void;
  readonly apply_crop: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
