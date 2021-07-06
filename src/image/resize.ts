import { xyToPos } from "./util";

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
