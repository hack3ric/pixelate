import { xyToI } from ".";
import { Dither } from "./dither";

function xyToIChecked(x: number, y: number, width: number, height: number): number {
  if (x > width - 1 || y > height - 1 || x < 0 || y < 0) {
    return -1;
  } else {
    return xyToI(x, y, width);
  }
}

export default function applyColor(input: ImageData, palette: Uint8ClampedArray[], dither: Dither) {
  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      const i = xyToIChecked(x, y, input.width, input.height);
      const [paletteColor, error] = closestInPalette(input.data.slice(i, i + 3), palette);
      for (let j = 0; j < 3; j++) {
        input.data[i + j] = paletteColor[j];
        for (let p of dither) {
          const errI = xyToIChecked(x + p[0], y + p[1], input.width, input.height);
          if (errI < 0) {
            continue;
          }
          input.data[errI + j] += Math.floor(error[j] * p[2]);
        }
      }
    }
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
  const paletteColor = palette.reduce<[Uint8ClampedArray, number]>((a, c) => {
    const d = colorDistance(color, c);
    return d < a[1] ? [c, d] : a;
  }, [new Uint8ClampedArray(), Infinity])[0];
  const error = new Float32Array(3);
  for (let i = 0; i < 3; i++) {
    error[i] = color[i] - paletteColor[i];
  }
  return [paletteColor, error];
}
