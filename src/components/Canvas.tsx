import { createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef } from "react";

const useStyles = makeStyles(theme => createStyles({
  canvas: {
    width: "100%",
    height: "100%",
    imageRendering: "pixelated",
    objectFit: "contain"
  }
}));

export interface CanvasProps {
  image: HTMLImageElement | ImageData;
  fetchImageData: (data: ImageData) => any;
}

export default function Canvas({ image, fetchImageData }: CanvasProps) {
  const styles = useStyles();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      throw new Error("Canvas not ready");
    }

    canvas.width = image.width;
    canvas.height = image.height;

    if (image instanceof HTMLImageElement) {
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, image.width, image.height);
      fetchImageData(data);
    } else {
      context.putImageData(image, 0, 0);
    }
  }, [image]); // eslint-disable-line

  return (
    <canvas ref={ref} className={styles.canvas} />
  )
}