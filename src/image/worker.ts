import * as Comlink from "comlink";
import { resize } from ".";
import applyColor from "./apply-color";
import { Dither } from "./dither";
import { PaletteType } from "./palette";
import medianCut from "./palette/median-cut";

function run(input: ImageData, size: number, colors: number, dither: Dither, paletteType: PaletteType): ImageData {
  console.log("I'm inside worker!");
  let resized;
  if (input.width > input.height) {
    resized = new ImageData(size, Math.trunc(size / input.width * input.height));
  } else {
    resized = new ImageData(Math.trunc(size / input.height * input.width), size);
  }
  resize(input, resized);

  let palette;
  switch (paletteType) {
    case "median-cut-variance":
      palette = medianCut(resized.data, colors, "variance");
      break;
    case "median-cut-range":
      palette = medianCut(resized.data, colors, "range");
      break;
  }

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
  run: typeof run;
  scale: typeof scale;
}

const api: ImageWorkerApi = { run, scale };

Comlink.expose(api);
