export default function medianCut(data: Uint8ClampedArray, colors: number, method: "variance" | "range"): Uint8ClampedArray[] {
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(data.slice(i, i + 3));
  }

  const Bucket = method === "variance" ? VarianceBucket : RangeBucket;
  const buckets = [new Bucket(pixels)];
  for (let i = 0; i < colors - 1; i++) {
    const bucketToSplit = buckets.reduce((a, c) => c.getSortKey() > a.getSortKey() ? c : a);
    buckets.push(bucketToSplit.splitOff());
  }
  return buckets.map(b => b.getMean());
}

interface Bucket {
  pixels: Uint8ClampedArray[];
  channelToSplit: number;
  calculate(): void;
  getSortKey(): number;
  getMean(): Uint8ClampedArray;
}

function bucketSplitOff<T extends Bucket>(bucket: T, ctor: (pixels: Uint8ClampedArray[]) => T): T {
  const cts = bucket.channelToSplit;
  const p = bucket.pixels;

  p.sort((a, b) => a[cts] - b[cts]);
  const newBucket = ctor(p.splice(Math.floor(p.length / 2)));
  bucket.calculate();
  return newBucket;
}

function bucketSplitOff2<T extends Bucket>(bucket: T, ctor: (pixels: Uint8ClampedArray[]) => T): T {
  const cts = bucket.channelToSplit;
  const p = bucket.pixels;
  
  p.sort((a, b) => a[cts] - b[cts]);
  const middle = Math.floor(p.length / 2);
  const medianPixelChannel = p[middle][cts];

  let left: number = middle;
  let right: number = middle;

  while (left >= 0 && p[left][cts] === medianPixelChannel) left--;
  left++;
  while (right < p.length && p[right][cts] === medianPixelChannel) right++;

  const leftCount = left + 1;
  const rightCount = p.length - right;
  const splitPoint = leftCount > rightCount
    ? Math.floor(left / 2)
    : Math.floor((right + p.length) / 2);

  const newBucket = ctor(p.splice(splitPoint));
  bucket.calculate();
  return newBucket;
}

class VarianceBucket implements Bucket {
  mean = new Float32Array(3);
  maxVariance = -1;
  channelToSplit = -1;

  constructor(public pixels: Uint8ClampedArray[]) {
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
        varianceXLength[j] += (this.pixels[i][j] - this.mean[j]) ** 2;
      }
    }
    let maxVarianceXLength: number;
    [maxVarianceXLength, this.channelToSplit] = varianceXLength.reduce((a, c, i) => c > a[0] ? [c, i] : a, [-1, -1]);
    this.maxVariance = maxVarianceXLength / this.pixels.length;
  }

  splitOff(): VarianceBucket {
    return bucketSplitOff2(this, p => new VarianceBucket(p));
  }

  getSortKey() {
    return this.maxVariance;
  }

  getMean(): Uint8ClampedArray {
    return new Uint8ClampedArray(this.mean);
  }
}


class RangeBucket implements Bucket {
  dimensions = new Uint8ClampedArray(3);
  channelToSplit = -1;

  constructor(public pixels: Uint8ClampedArray[]) {
    this.calculate();
  }

  calculate() {
    const x = this.pixels.reduce((a, c) => {
      for (let j = 0; j < 3; j++) {
        a[j] = Math.min(a[j], c[j]);
        a[3 + j] = Math.max(a[3 + j], c[j]);
      }
      return a;
    }, [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]);
    for (let j = 0; j < 3; j++) {
      this.dimensions[j] = x[3 + j] - x[j];
    }
    [, this.channelToSplit] = this.dimensions.reduce((a, c, i) => c > a[0] ? [c, i] : a, [-1, -1]);
  }

  splitOff(): RangeBucket {
    return bucketSplitOff2(this, p => new RangeBucket(p));
  }

  getSortKey() {
    return this.dimensions[this.channelToSplit];
  }

  getMean(): Uint8ClampedArray {
    return new Uint8ClampedArray(this.pixels
      .reduce((a, c) => {
        for (let j = 0; j < 3; j++) {
          a[j] += c[j];
        }
        return a;
      }, new Uint32Array(3))
      .map(v => v / this.pixels.length));
  }
}
