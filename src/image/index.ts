export function getImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function() {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = function(event) {
      reject("Failed loading image");
    }
    image.src = url
  });
}

export function resize(from: ImageData, to: ImageData) {
  for (let toY = 0; toY < to.height; toY++) {
    for (let toX = 0; toX < to.width; toX++) {
      const toPos = xyToI(toX, toY, to.width, to.height);
      const fromX = Math.floor(toX * from.width / to.width);
      const fromY = Math.floor(toY * from.height / to.height);
      const fromPos = (fromY * from.width + fromX) * 4;

      for (let i = 0; i < 4; i++) {
        to.data[toPos + i] = from.data[fromPos + i]
      }
    }
  }
}

export function xyToI(x: number, y: number, width: number, height: number): number {
  if (x > width - 1 || y > height - 1 || x < 0 || y < 0) {
    return -1;
  } else {
    return (y * width + x) * 4;
  }
}
