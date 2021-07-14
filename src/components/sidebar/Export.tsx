import { Collapse, List, ListItem, ListItemText, Typography, Button } from "@material-ui/core";
import { ExpandLessRounded, ExpandMoreRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { SliderParameter, SidebarPaper } from "./common";
import * as Comlink from "comlink";
import { ImageWorkerApi } from "../../image/image.worker";
import { Dimensions } from "../../image/resize";

export interface ExportProps {
  imageWorker: React.MutableRefObject<Comlink.Remote<ImageWorkerApi> | undefined>;
  filename?: string;
  outputData?: ImageData;
  pixelScale: number;
  onPixelScaleChange: (newValue: number) => void;
  dimensions?: Dimensions;
}

export default function Export({ imageWorker, filename, outputData, pixelScale, onPixelScaleChange, dimensions }: ExportProps) {
  const [open, setOpen] = useState(true);

  async function handleExport() {
    if (!filename || !outputData || !imageWorker.current) return;

    const tw = outputData.width * pixelScale;
    const th = outputData.height * pixelScale;

    const exportData = await imageWorker.current.scale(outputData, pixelScale);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas not ready");
    canvas.width = tw;
    canvas.height = th;
    context.putImageData(exportData, 0, 0);

    const exportURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = filename.replace(/\.[^/.]+$/, "-pixelated.png");
    link.href = exportURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <SidebarPaper>
      <List disablePadding>
        <ListItem dense button onClick={() => setOpen(!open)}>
          <ListItemText primary="Export" />
          {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </ListItem>
        <Collapse in={open}>
          <SliderParameter
            text="Pixel Scale"
            value={pixelScale}
            onChange={onPixelScaleChange}
            range={[1, 8]}
            step={1}
            marks
          />
          <ListItem dense style={{ paddingLeft: 8 }}>
            <Button disabled={!outputData} color="secondary" onClick={handleExport}>Export</Button>
            <div style={{ flexGrow: 1 }}></div>
            <Typography variant="body2" color="textSecondary">
              {dimensions
                ? `${dimensions.width * pixelScale} x ${dimensions.height * pixelScale}`
                : `${pixelScale}x Pixelated Image Size`}
            </Typography>
          </ListItem>
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
