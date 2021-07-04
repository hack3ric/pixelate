import { createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef } from "react";

const useStyles = makeStyles(theme => createStyles({
  canvas: {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },
  pixelated: {
    imageRendering: "pixelated"
  },
  crispEdges: {
    imageRendering: "crisp-edges"
  }
}));

export interface CanvasProps {
  image: HTMLImageElement | ImageData;
  fetchImageData?: (data: ImageData) => any;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

export default function Canvas({ image, fetchImageData, onMouseDown, onMouseUp }: CanvasProps) {
  const styles = useStyles();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      throw new Error("Canvas not ready");
    }

    const w = image.width;
    const h = image.height;

    if (w > 4096 || h > 4096) {
      if (w > h) {
        canvas.width = 4096;
        canvas.height = 4096 / w * h;
      } else {
        canvas.width = 4096 / h * w;
        canvas.height = 4096;
      }
    } else {
      canvas.width = w;
      canvas.height = h;
    }

    if (image instanceof HTMLImageElement) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      if (fetchImageData) fetchImageData(data);
    } else {
      context.putImageData(image, 0, 0);
    }
  }, [image]); // eslint-disable-line

  return (
    <canvas
      ref={ref}
      className={`${styles.canvas} ${styles.crispEdges} ${styles.pixelated}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown} // HACK: Touch event <- Mouse Event
      onTouchEnd={onMouseUp}
    />
  )
}
