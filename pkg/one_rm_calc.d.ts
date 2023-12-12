/* tslint:disable */
/* eslint-disable */
/**
* @param {string} name
* @returns {string}
*/
export function say_hi(name: string): string;
/**
* @param {number} reps
* @param {number} weight
* @returns {number | undefined}
*/
export function find_onerm(reps: number, weight: number): number | undefined;
/**
*/
export enum Cell {
  Taken = 0,
  Free = 1,
}
/**
*/
export enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}
/**
*/
export class Position {
  free(): void;
}
/**
*/
export class Tetris {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @returns {Tetris}
*/
  static new(width: number, height: number): Tetris;
/**
* @param {Direction} dir
* @returns {boolean}
*/
  handle_move(dir: Direction): boolean;
/**
* @param {boolean} clockwise
* @returns {boolean}
*/
  handle_rotate(clockwise: boolean): boolean;
/**
* @returns {number}
*/
  grid(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_position_free: (a: number) => void;
  readonly __wbg_tetris_free: (a: number) => void;
  readonly tetris_new: (a: number, b: number) => number;
  readonly tetris_handle_move: (a: number, b: number) => number;
  readonly tetris_handle_rotate: (a: number, b: number) => number;
  readonly tetris_grid: (a: number) => number;
  readonly say_hi: (a: number, b: number, c: number) => void;
  readonly find_onerm: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
