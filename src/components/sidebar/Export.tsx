import { Collapse, List, ListItem, ListItemText, Typography, Slider } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import SidebarPaper from "./SidebarPaper";
import { useSidebarStyles, ParameterText } from "./common";
import * as Comlink from "comlink";
import { ImageWorkerApi } from "../../image/image.worker";

export interface ExportProps {
  imageWorker: React.MutableRefObject<Comlink.Remote<ImageWorkerApi> | undefined>;
  filename?: string;
  outputData?: ImageData;
  pixelScale: number;
  onPixelScaleChange: (newValue: number) => void;
}

export default function Export({ imageWorker, filename, outputData, pixelScale, onPixelScaleChange }: ExportProps) {
  const styles = useSidebarStyles();
  const [open, setOpen] = useState(true);

  async function handleExport() {
    if (!outputData || !imageWorker.current) return;

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
    link.download = `pixelated-${filename}`.replace(/\.[^/.]+$/, ".png");
    link.href = exportURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <SidebarPaper>
      <List disablePadding>
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemText primary="Export" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open}>
          <ListItem className={styles.parameter}>
            <ParameterText>Pixel Scale</ParameterText>
            <Slider
              color="secondary"
              min={1}
              max={8}
              step={1}
              valueLabelDisplay="auto"
              value={pixelScale}
              marks
              onChange={(_e, newValue) => onPixelScaleChange(newValue as number)}
            />
          </ListItem>
          <ListItem dense disabled={!outputData} button onClick={handleExport}>
            <ListItemText primary="Export" primaryTypographyProps={{ variant: "button" }} />
            <Typography variant="body2" color="textSecondary">
              {outputData
                ? `${outputData.width * pixelScale}x${outputData.height * pixelScale}`
                : `${pixelScale}x Pixelated Image Size`}
            </Typography>
          </ListItem>
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
