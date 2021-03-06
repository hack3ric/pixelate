import { posToXy, xyToPos } from "./util";

export type Dither = [number, number, number][];

export type DitherMethod =
  | "floyd-steinberg"
  | "aktinson"
  | "none";

export const ditherMethods: { [key in DitherMethod]: Dither } = {
  "floyd-steinberg": [
    [1, 0, 7/20],
    [-1, 1, 3/20],
    [0, 1, 5/20],
    [1, 1, 1/20]
  ],
  "aktinson": [
    [1, 0, 1/8],
    [2, 0, 1/8],
    [-1, 1, 1/8],
    [0, 1, 1/8],
    [1, 1, 1/8],
    [0, 2, 1/8]
  ],
  "none": []
};

export default function applyColor(input: ImageData, palette: Uint8ClampedArray[], dither: Dither) {
  const iw = input.width;
  const ih = input.height;
  const id = input.data;

  for (let pos = 0; pos < id.length; pos += 4) {
    const [x, y] = posToXy(pos, iw);
    const [paletteColor, error] = closestInPalette(id.slice(pos, pos + 3), palette);
    for (let j = 0; j < 3; j++) {
      id[pos + j] = paletteColor[j];
      for (let p of dither) {
        const errPos = xyToPosChecked(x + p[0], y + p[1], iw, ih);
        if (errPos < 0) continue;
        id[errPos + j] += Math.trunc(error[j] * p[2]);
      }
    }
  }
}

function xyToPosChecked(x: number, y: number, width: number, height: number): number {
  if (x > width - 1 || y > height - 1 || x < 0 || y < 0) {
    return -1;
  } else {
    return xyToPos(x, y, width);
  }
}

function colorDistance(a: Uint8ClampedArray, b: Uint8ClampedArray) {
  let distance = 0;
  for (let i = 0; i < 3; i++) {
    distance += Math.pow(a[i] - b[i], 2);
  }
  return distance
}

function closestInPalette(color: Uint8ClampedArray, palette: Uint8ClampedArray[]): [Uint8ClampedArray, Float32Array] {
  const paletteColor = palette.reduce(
    (a, c) => {
      const d = colorDistance(color, c);
      return d < a[1] ? [c, d] as const : a;
    },
    [new Uint8ClampedArray(), Infinity] as const
  )[0];
  const error = new Float32Array(3);
  for (let i = 0; i < 3; i++) {
    error[i] = color[i] - paletteColor[i];
  }
  return [paletteColor, error];
}
