export default function medianCut2(data: Uint8ClampedArray) {
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(data.slice(i, i + 3));
  }
  const vbox = new Vbox(pixels);
  console.log(vbox.dimensions.slice(0), vbox.pixels.length);
  const newVbox = vbox.splitOff();
  console.log(vbox.dimensions, vbox.pixels.length, newVbox.dimensions.slice(0), newVbox.pixels.length);
  const newNewVbox = newVbox.splitOff();
  console.log(newVbox.dimensions, newVbox.pixels.length, newNewVbox.dimensions, newNewVbox.pixels.length);
}

class Vbox {
  pixels: Uint8ClampedArray[];
  dimensions: Uint8ClampedArray = new Uint8ClampedArray(3);

  constructor(pixels: Uint8ClampedArray[]) {
    this.pixels = pixels;
    this.calculate();
  }

  calculate() {
    for (let j = 0; j < 3; j++) {
      const [min, max] = this.pixels.reduce((a, c) => [Math.min(a[0], c[j]), Math.max(a[1], c[j])], [Infinity, -Infinity]);
      this.dimensions[j] = max - min;
    }
  }

  splitOff(): Vbox {
    const [_maxDimension, maxChannel] = this.dimensions.reduce((a, c, i) => c > a[0] ? [c, i] : a, [-1, -1]);
    this.pixels.sort((a, b) => a[maxChannel] - b[maxChannel]);
    const newVbox = new Vbox(this.pixels.splice(Math.floor(this.pixels.length / 2)));
    this.calculate();
    return newVbox;
  }
}
