export default function medianCut2(data: Uint8ClampedArray, colors: number): Uint8ClampedArray[] {
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(data.slice(i, i + 3));
  }
  const buckets = [new Bucket(pixels)];
  for (let i = 0; i < colors - 1; i++) {
    const bucketToSplit = buckets.reduce((a, c) => c.dimensions[c.channelToSplit] > a.dimensions[a.channelToSplit] ? c : a);
    buckets.push(bucketToSplit.splitOff());
  }
  return buckets.map(v => v.mean());
}

class Bucket {
  pixels: Uint8ClampedArray[];
  dimensions = new Uint8ClampedArray(3);
  channelToSplit = -1;

  constructor(pixels: Uint8ClampedArray[]) {
    this.pixels = pixels;
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

  splitOff(): Bucket {
    this.pixels.sort((a, b) => a[this.channelToSplit] - b[this.channelToSplit]);
    const newVbox = new Bucket(this.pixels.splice(Math.floor(this.pixels.length / 2)));
    this.calculate();
    return newVbox;
  }

  mean(): Uint8ClampedArray {
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
