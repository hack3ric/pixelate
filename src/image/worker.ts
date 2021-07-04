import * as Comlink from "comlink";
import { resize } from ".";
import applyColor from "./apply-color";
import { DitherMethod } from "./dither";
import medianCut from "./median-cut";

function apply(input: ImageData, size: number, colors: number, dither: DitherMethod): ImageData {
  console.log("I'm inside worker!");
  let resized;
  if (input.width > input.height) {
    resized = new ImageData(size, Math.trunc(size / input.width * input.height));
  } else {
    resized = new ImageData(Math.trunc(size / input.height * input.width), size);
  }

  resize(input, resized);
  console.time("medianCut");
  const palette = medianCut(resized.data, colors, "variance");
  console.timeEnd("medianCut");

  for (let color of palette) {
    console.log("%c          ", `background: rgb(${color[0]}, ${color[1]}, ${color[2]})`)
  }

  applyColor(resized, palette, dither);
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
