export type DitherMethod =
  | "FloydSteinberg"
  | "Aktinson"
  | "Eric"
  | "None";

export type Dither = [number, number, number][];

export const Eric: Dither = [
  [1, 0, 1/4],
  [0, 1, 1/4],
  [1, 1, 1/4]
];

export const FloydSteinberg: Dither = [
  [1, 0, 7/16],
  [-1, 1, 3/16],
  [0, 1, 5/16],
  [1, 1, 1/16]
];

export const Aktinson: Dither = [
  [1, 0, 1/8],
  [2, 0, 1/8],
  [-1, 1, 1/8],
  [0, 1, 1/8],
  [1, 1, 1/8],
  [0, 2, 1/8]
];

export const None: Dither = [];
