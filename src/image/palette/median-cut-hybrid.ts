export default function medianCutHybrid(data: Uint8ClampedArray, colors: number): Uint8ClampedArray[] {
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(data.slice(i, i + 3));
  }

  const buckets = [new Bucket(pixels)];
  let rangeCount = 0;
  let varianceCount = 0;
  for (let i = 0; i < colors - 1; i++) {
    const bucketVariance = buckets.reduce((a, c) => c.maxVariance > a.maxVariance ? c : a);
    const bucketRange = buckets.reduce((a, c) => c.dimensions[c.maxRangeChannel] > a.dimensions[a.maxRangeChannel] ? c : a);
    const [bucketToSplit, how] = bucketVariance.pixels.length * 2 > bucketRange.pixels.length
      ? [bucketVariance, "variance"] as const
      : [bucketRange, "range"] as const;
    if (how === "range") {
      rangeCount++;
    } else {
      varianceCount++;
    }
    buckets.push(bucketToSplit.splitOff(how));
  }
  console.log(`Range: ${rangeCount}; Variance: ${varianceCount}`);
  return buckets.map(b => new Uint8ClampedArray(b.mean));
}

class Bucket {
  mean = new Float32Array(3);
  maxVariance = -1;
  maxVarianceChannel = -1;
  dimensions = new Uint8ClampedArray(3);
  maxRangeChannel = -1;

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
    [maxVarianceXLength, this.maxVarianceChannel] = varianceXLength.reduce((a, c, i) => c > a[0] ? [c, i] : a, [-1, -1]);
    this.maxVariance = maxVarianceXLength / this.pixels.length;

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
    [, this.maxRangeChannel] = this.dimensions.reduce((a, c, i) => c > a[0] ? [c, i] : a, [-1, -1]);
  }

  splitOff(how: "variance" | "range"): Bucket {
    const channel = how === "variance" ? this.maxVarianceChannel : this.maxRangeChannel;
    this.pixels.sort((a, b) => a[channel] - b[channel]);
    const newBucket = new Bucket(this.pixels.splice(Math.floor(this.pixels.length / 2)));
    this.calculate();
    return newBucket;
  }
}
