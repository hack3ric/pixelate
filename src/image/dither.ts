export type DitherMethod =
  | "floyd-steinberg"
  | "aktinson"
  | "eric"
  | "none";

export type Dither = [number, number, number][];

export const ditherMethods: { [key in DitherMethod]: Dither } = {
  "floyd-steinberg": [
    [1, 0, 7/16],
    [-1, 1, 3/16],
    [0, 1, 5/16],
    [1, 1, 1/16]
  ],
  "aktinson": [
    [1, 0, 1/8],
    [2, 0, 1/8],
    [-1, 1, 1/8],
    [0, 1, 1/8],
    [1, 1, 1/8],
    [0, 2, 1/8]
  ],
  "eric": [
    [1, 0, 1/4],
    [0, 1, 1/4],
    [1, 1, 1/4]
  ],
  "none": []
};
