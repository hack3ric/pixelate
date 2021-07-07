export default function octree(data: Uint8ClampedArray, depth: number): Uint8ClampedArray[] {
  const colorMap = new Map<number, [number, Uint32Array]>();
  for (let i = 0; i < data.length; i += 4) {
    const color = data.slice(i, i + 3);
    const index = rgbIndex(color, depth);
    const [count, colorSum] = colorMap.get(index) ?? [0, new Uint32Array(3)];
    for (let j = 0; j < 3; j++) {
      colorSum[j] += color[j];
    }
    colorMap.set(index, [count + 1, colorSum]);
  }
  // colorMap.forEach((v, k) => {
  //   console.log(`${k.toString(8).padStart(depth, "0")} => ${v}`);
  // });
  // console.log("Total: ", colorMap.size);
  const result = [];
  for (let [count, colorSum] of colorMap.values()) {
    result.push(new Uint8ClampedArray(colorSum.map(v => v / count)));
  }
  return result;
}

function rgbIndex(rgb: Uint8ClampedArray, depth: number) {
  let result = 0;
  for (let i = 7; i > 0 && i > 7 - depth; i--) {
    for (let j = 0; j < 3; j++) {
      const bit = (rgb[j] >> i) - (rgb[j] >> i + 1) * 2;
      result += bit << (2 - j + 3 * (i - 8 + depth))
    }
  }
  return result;
}
