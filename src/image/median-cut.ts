export function medianCut(data: Uint8ClampedArray, colors: number): Uint8ClampedArray[] {
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(data.slice(i, i + 3));
  }
  const buckets = [new Bucket(pixels)];
  for (let i = 0; i < colors - 1; i++) {
    const bucketToSplit = buckets.reduce((a, c) => c.maxVariance > a.maxVariance ? c : a);
    buckets.push(bucketToSplit.splitOff());
  }
  return buckets.map(b => new Uint8ClampedArray(b.mean));
}

class Bucket {
  mean = new Float32Array(3);
  maxVariance = -1;
  channelToSplit = -1;

  constructor(private pixels: Uint8ClampedArray[]) {
    this.calculate();
  }

  calculate() {
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < 3; j++) {
        this.mean[j] += this.pixels[i][j];
      }
    }
    for (let j = 0; j < 3; j++) {
      this.mean[j] /= this.pixels.length;
    }

    const varianceXLength = new Float32Array(3);
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < 3; j++) {
        varianceXLength[j] += Math.pow(this.pixels[i][j] - this.mean[j], 2);
      }
    }
    let maxVarianceXLength: number;
    [maxVarianceXLength, this.channelToSplit] = varianceXLength.reduce((a, c, i) => c > a[0] ? [c, i] : a, [-1, -1]);
    this.maxVariance = maxVarianceXLength / this.pixels.length;
  }

  splitOff(): Bucket {
    this.pixels.sort((a, b) => a[this.channelToSplit] - b[this.channelToSplit]);
    const newBucket = new Bucket(this.pixels.splice(Math.floor(this.pixels.length / 2)));
    this.calculate();
    return newBucket;
  }
}
