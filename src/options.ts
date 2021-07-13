import { useReducer } from "react";
import { DitherMethod } from "./image/apply-color";
import { PaletteType } from "./image/palette";

export type Options = {
  size: number,
  paletteType: PaletteType,
  colorCount: number,
  ditherMethod: DitherMethod,
  pixelScale: number
};

export const initialOptions: Options = {
  size: 320,
  paletteType: "octree",
  colorCount: 32,
  ditherMethod: "aktinson",
  pixelScale: 4
};

export type OptionsAction =
  | ["size", number]
  | ["paletteType", PaletteType]
  | ["colorCount", number]
  | ["ditherMethod", DitherMethod]
  | ["pixelScale", number]

export function optionsReducer(options: Options, action: OptionsAction): Options {
  return { ...options, [action[0]]: action[1] }
}

export function useOptions() {
  // TODO: localStorage
  return useReducer(optionsReducer, initialOptions);
}
