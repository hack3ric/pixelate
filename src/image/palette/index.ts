export type PaletteType =
  | "median-cut-variance"
  | "median-cut-range"
  | "octree";

export { default as medianCut } from "./median-cut";
export { default as octree } from "./octree";
