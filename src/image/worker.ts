import * as Comlink from "comlink";
import { resize } from ".";
import applyColor from "./apply-color";
import { DitherMethod } from "./dither";
import { medianCut } from "./median-cut";

function apply(input: ImageData, size: number, colors: number, dither: DitherMethod): ImageData {
  console.log("I'm inside worker!");
  let resized;
  if (input.width > input.height) {
    resized = new ImageData(size, Math.trunc(size / input.width * input.height));
  } else {
    resized = new ImageData(Math.trunc(size / input.height * input.width), size);
  }
  const t1 = performance.now();
  resize(input, resized);
  const t2 = performance.now();
  const palette = medianCut(resized.data, colors);
  const t3 = performance.now();

  console.log(palette);
  for (let color of palette) {
    console.log("%c          ", `background: rgb(${color[0]}, ${color[1]}, ${color[2]})`)
  }

  const t4 = performance.now();
  applyColor(resized, palette, dither);
  const t5 = performance.now();
  
  console.log(`Resize: ${t2 - t1}ms\nMedian Cut: ${t3 - t2}ms\nApply: ${t5 - t4}ms`);

  return resized;
}

function scale(input: ImageData, scale: number): ImageData {
  const output = new ImageData(input.width * scale, input.height * scale);
  resize(input, output);
  return output;
}

export interface ImageWorkerApi {
  apply: typeof apply;
  scale: typeof scale;
}

const api: ImageWorkerApi = { apply, scale };

Comlink.expose(api);
