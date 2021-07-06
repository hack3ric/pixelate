export function getImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = function (_event) {
      reject("Failed loading image");
    }
    image.src = url
  });
}

export function xyToPos(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}

export function posToXy(pos: number, width: number): [number, number] {
  const y = Math.floor(pos / 4 / width);
  const x = pos / 4 - y * width;
  return [x, y];
}
