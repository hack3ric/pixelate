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

export function resizeNearestNeighbor(from: ImageData, to: ImageData) {
  const fw = from.width;
  const fh = from.height;
  const tw = to.width;
  const th = to.height;

  for (let toY = 0; toY < th; toY++) {
    for (let toX = 0; toX < tw; toX++) {
      const toPos = xyToPos(toX, toY, tw);
      const fromX = Math.floor(toX * fw / tw);
      const fromY = Math.floor(toY * fh / th);
      const fromPos = xyToPos(fromX, fromY, fw);

      for (let i = 0; i < 4; i++) {
        to.data[toPos + i] = from.data[fromPos + i]
      }
    }
  }
}

export function resizeDownSupersampling(from: ImageData, to: ImageData) {
  const fw = from.width;
  const fh = from.height;
  const tw = to.width;
  const th = to.height;

  for (let toY = 0; toY < th; toY++) {
    for (let toX = 0; toX < tw; toX++) {
      const toPos = xyToPos(toX, toY, tw);
      const fromX = Math.floor(toX * fw / tw);
      const fromY = Math.floor(toY * fh / th);

      const sampleSizeW = Math.floor(fw / tw / 1.5);
      const sampleSizeH = Math.floor(fh / th / 1.5);

      let data = [0, 0, 0, 0];
      for (let x = 0; x < sampleSizeW; x++) {
        for (let y = 0; y < sampleSizeH; y++) {
          for (let i = 0; i < 4; i++) {
            data[i] += from.data[xyToPos(fromX + x, fromY + y, fw) + i]
          }
        }
      }
      for (let i = 0; i < 4; i++) {
        to.data[toPos + i] = data[i] / sampleSizeW / sampleSizeH;
      }
    }
  }
}

export function xyToPos(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}
