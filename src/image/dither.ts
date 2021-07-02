export type DitherMethod = [number, number, number][];

export const None: DitherMethod = [];

export const Eric: DitherMethod = [
  [0, 1, 1/4],
  [1, 0, 1/4],
  [1, 1, 1/4]
];

export const FloydSteinberg: DitherMethod = [
  [0, 1, 7/16],
  [1, -1, 3/16],
  [1, 0, 5/16],
  [1, 1, 1/16]
];

export const Aktinson: DitherMethod = [
  [0, 1, 1/8],
  [0, 2, 1/8],
  [1, -1, 1/8],
  [1, 0, 1/8],
  [1, 1, 1/8],
  [2, 0, 1/8]
];
