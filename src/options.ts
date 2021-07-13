import { useReducer } from "react";
import { DitherMethod } from "./image/apply-color";
import { PaletteType } from "./image/palette";

export type Options = {
  size: number,
  dimension: "width" | "height",
  paletteType: PaletteType,
  colorCount: number,
  ditherMethod: DitherMethod,
  pixelScale: number
};

export type OptionsAction =
  | ["size", number]
  | ["dimension", "width" | "height"]
  | ["paletteType", PaletteType]
  | ["colorCount", number]
  | ["ditherMethod", DitherMethod]
  | ["pixelScale", number];

export const initialOptions: Options = {
  size: 320,
  dimension: "width",
  paletteType: "octree",
  colorCount: 32,
  ditherMethod: "aktinson",
  pixelScale: 4
};

export function optionsReducer(options: Options, action: OptionsAction): Options {
  if (typeof window !== "undefined") {
    localStorage.setItem(action[0], JSON.stringify(action[1]));
  }
  return { ...options, [action[0]]: action[1] };
}

export function useOptions() {
  const init: { [key: string]: any } = {};
  if (typeof window !== "undefined") {
    for (let key in initialOptions) {
      const itemString = localStorage.getItem(key);
      if (itemString != null) {
        init[key] = JSON.parse(itemString);
      }
    }
  }
  return useReducer(optionsReducer, { ...initialOptions, ...init });
}
