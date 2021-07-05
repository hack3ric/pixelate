export default function octree(data: Uint8ClampedArray, depth: number) {
  const colorMap = new Map<number, number>();
  for (let i = 0; i < data.length; i += 4) {
    const color = data.slice(i, i + 3);
    const index = rgbIndex(color, depth);
    const count = colorMap.get(index) ?? 0;
    colorMap.set(index, count + 1);
  }
  colorMap.forEach((v, k) => {
    console.log(`${k.toString(8).padStart(depth, "0")} => ${v}`);
  });

  console.log("Total: ", colorMap.size);
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
