import * as Comlink from "comlink";
import { resize, resizeDown } from ".";
import applyColor from "./apply-color";
import { Dither } from "./dither";
import { PaletteType } from "./palette";
import medianCut from "./palette/median-cut";

function run(input: ImageData, size: number, colors: number, dither: Dither, paletteType: PaletteType): ImageData {
  const iw = input.width;
  const ih = input.height;

  let output: ImageData;
  if (iw > ih) {
    output = new ImageData(size, Math.trunc(size / iw * ih));
  } else {
    output = new ImageData(Math.trunc(size / ih * iw), size);
  }

  if (iw < output.width || ih < output.height) {
    resize(input, output);
  } else {
    resizeDown(input, output);
  }

  let palette: Uint8ClampedArray[];
  switch (paletteType) {
    case "median-cut-variance":
      palette = medianCut(output.data, colors, "variance");
      break;
    case "median-cut-range":
      palette = medianCut(output.data, colors, "range");
      break;
  }

  for (let color of palette) {
    console.log("%c          ", `background: rgb(${color[0]}, ${color[1]}, ${color[2]})`)
  }

  applyColor(output, palette, dither);
  return output;
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
