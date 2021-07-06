export type PaletteType =
  | "median-cut-variance"
  | "median-cut-range"
  | "median-cut-hybrid";

export { default as medianCut } from "./median-cut";
export { default as medianCutHybrid } from "./median-cut-hybrid";
