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
