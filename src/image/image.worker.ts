import * as Comlink from "comlink";
import { resizeNearestNeighbor, resizeDownSupersampling, Dimensions } from "./resize";
import applyColor, { Dither } from "./apply-color";
import { PaletteType } from "./palette";
import medianCut from "./palette/median-cut";
import octree from "./palette/octree";

function run(
  input: ImageData,
  dimensions: Dimensions,
  colors: number,
  dither: Dither,
  paletteType: PaletteType
): ImageData {
  console.time("total");
  
  const iw = input.width;
  const ih = input.height;
  const { width: ow, height: oh } = dimensions;

  let output: ImageData;
  if (iw === ow && ih === oh) {
    output = new ImageData(input.data, ow, oh);
  } else {
    output = new ImageData(ow, oh);
    console.time("resize");
    if (iw / ow / 1.5 < 2 || ih / oh / 1.5 < 2) {
      resizeNearestNeighbor(input, output);
    } else {
      resizeDownSupersampling(input, output);
    }
    console.timeEnd("resize");
  }

  let palette: Uint8ClampedArray[];
  console.time("palette");
  switch (paletteType) {
    case "median-cut-variance":
      palette = medianCut(output.data, colors, "variance");
      break;
    case "median-cut-range":
      palette = medianCut(output.data, colors, "range");
      break;
    case "octree":
      palette = octree(output.data, 2);
      break;
  }
  console.timeEnd("palette");

  console.time("apply");
  applyColor(output, palette, dither);
  console.timeEnd("apply");

  console.timeEnd("total");

  logPalette(palette);

  return output;
}

function colorToHex(color: Uint8ClampedArray): string {
  return ((color[0] << 16) + (color[1] << 8) + color[2]).toString(16).padStart(6, "0");
}

function logPalette(palette: Uint8ClampedArray[]) {
  for (let color of palette) {
    const hex = colorToHex(color);
    console.log(`%c        %c #${hex}`, `background-color: #${hex}`, "");
  }
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
