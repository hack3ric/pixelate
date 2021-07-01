export function getImageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise(resolve => {
    const image = new Image();
    image.onload = function() {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.src = url
  });
}
