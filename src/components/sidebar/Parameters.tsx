import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { ExpandLessRounded, ExpandMoreRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { DitherMethod } from "../../image/apply-color";
import { PaletteType } from "../../image/palette";
import { SliderParameter, SidebarPaper, RadioParameter } from "./common";

export interface ParametersProps {
  size: number;
  paletteType: PaletteType,
  colorCount: number,
  ditherMethod: DitherMethod,
  onSizeChange: (v: number) => void;
  onPaletteTypeChange: (v: PaletteType) => void;
  onColorCountChange: (v: number) => void;
  onDitherMethodChange: (v: DitherMethod) => void;
}

function marks(...m: number[]): { value: number }[] {
  return m.map(i => ({ value: i }));
}

export default function Parameters(props: ParametersProps) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarPaper>
      <List disablePadding>
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemText primary="Parameters" />
          {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </ListItem>
        <Collapse in={open}>
          <SliderParameter
            text="Image Size"
            value={props.size}
            onChange={props.onSizeChange}
            range={[128, 1024]}
            step={64}
            marks={marks(128, 256, 384, 512, 640, 768, 896, 1024)}
          />
          <RadioParameter<PaletteType>
            text="Palette Type"
            value={props.paletteType}
            onChange={props.onPaletteTypeChange}
            labels={{
              "median-cut-variance": "Median Cut (variance)",
              "median-cut-range": "Median Cut (range)"
            }}
          />
          <SliderParameter
            text="Colour Count"
            value={props.colorCount}
            onChange={props.onColorCountChange}
            range={[8, 64]}
            step={4}
            marks={marks(8, 16, 24, 32, 40, 48, 56, 64)}
          />
          <RadioParameter<DitherMethod>
            text="Dithering Method"
            value={props.ditherMethod}
            onChange={props.onDitherMethodChange}
            labels={{
              "floyd-steinberg": "Floyd-Steinberg",
              "aktinson": "Aktinson",
              "eric": "hackereric",
              "none": "None"
            }}
          />
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
