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
            range={[128, 512]}
            step={64}
            marks
          />
          <RadioParameter<PaletteType>
            text="Palette Type"
            value={props.paletteType}
            onChange={props.onPaletteTypeChange}
            labels={{
              "octree": "Octree",
              "median-cut-variance": "Median Cut (variance)",
              "median-cut-range": "Median Cut (range)"
            }}
          />
          <Collapse in={props.paletteType !== "octree"}>
            <SliderParameter
              text="Colour Count"
              value={props.colorCount}
              onChange={props.onColorCountChange}
              range={[8, 64]}
              step={4}
              marks
            />
          </Collapse>
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
