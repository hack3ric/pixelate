import * as Comlink from "comlink";
import { resize } from ".";
import applyColor from "./apply-color";
import { DitherMethod } from "./dither";
import { medianCut } from "./median-cut";

function apply(input: ImageData, scale: number, colors: number, dither: DitherMethod): ImageData {
  console.log("I'm inside worker!");
  const tw = Math.floor(input.width / scale);
  const th = Math.floor(input.height / scale);
  const resized = new ImageData(tw, th);
  resize(input, resized);
  const palette = medianCut(resized.data, colors);
  console.log(palette);
  for (let color of palette) {
    console.log("%c          ", `background: rgb(${color[0]}, ${color[1]}, ${color[2]})`)
  }
  applyColor(resized, palette, dither);
  // TODO
  return resized;
}

export interface ImageWorkerApi {
  apply: typeof apply
}

const api: ImageWorkerApi = {
  apply
};

Comlink.expose(api);
