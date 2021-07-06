import * as Comlink from "comlink";
import { resizeNearestNeighbor, resizeDownSupersampling } from "./resize";
import applyColor, { Dither } from "./apply-color";
import { medianCutHybrid, PaletteType } from "./palette";
import medianCut from "./palette/median-cut";

function run(input: ImageData, size: number, colors: number, dither: Dither, paletteType: PaletteType): ImageData {
  const iw = input.width;
  const ih = input.height;

  let ow: number;
  let oh: number;
  if (iw > ih) {
    ow = size;
    oh = Math.trunc(size / iw * ih);
  } else {
    ow = Math.trunc(size / ih * iw);
    oh = size;
  }
  let output: ImageData;
  if (iw === ow && ih === oh) {
    output = new ImageData(input.data, ow, oh);
  } else {
    output = new ImageData(ow, oh);
    if (iw / ow / 1.5 < 2 || ih / oh / 1.5 < 2) {
      resizeNearestNeighbor(input, output);
    } else {
      resizeDownSupersampling(input, output);
    }
  }

  let palette: Uint8ClampedArray[];
  switch (paletteType) {
    case "median-cut-variance":
      palette = medianCut(output.data, colors, "variance");
      break;
    case "median-cut-range":
      palette = medianCut(output.data, colors, "range");
      break;
    case "median-cut-hybrid":
      palette = medianCutHybrid(output.data, colors);
  }

  for (let color of palette) {
    console.log("%c          ", `background: rgb(${color[0]}, ${color[1]}, ${color[2]})`)
  }

  applyColor(output, palette, dither);
  return output;
}

function scale(input: ImageData, scale: number): ImageData {
  const output = new ImageData(input.width * scale, input.height * scale);
  resizeNearestNeighbor(input, output);
  return output;
}

export interface ImageWorkerApi {
  run: typeof run;
  scale: typeof scale;
}

const api: ImageWorkerApi = { run, scale };

Comlink.expose(api);
