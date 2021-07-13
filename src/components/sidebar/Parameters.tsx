import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { ExpandLessRounded, ExpandMoreRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { DitherMethod } from "../../image/apply-color";
import { PaletteType } from "../../image/palette";
import { Options, OptionsAction } from "../../options";
import { SliderParameter, SidebarPaper, RadioParameter } from "./common";

export interface ParametersProps {
  options: Options;
  setOptions: (v: OptionsAction) => void;
}

export default function Parameters({ options, setOptions }: ParametersProps) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarPaper>
      <List disablePadding>
        <ListItem dense button onClick={() => setOpen(!open)}>
          <ListItemText primary="Parameters" />
          {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </ListItem>
        <Collapse in={open}>
          <SliderParameter
            text="Image Size"
            value={options.size}
            onChange={v => setOptions(["size", v])}
            range={[128, 768]}
            step={64}
            marks
          />
          <RadioParameter<PaletteType>
            text="Palette Type"
            value={options.paletteType}
            onChange={v => setOptions(["paletteType", v])}
            labels={{
              "octree": "Octree",
              "median-cut-variance": "Median Cut (variance)",
              "median-cut-range": "Median Cut (range)"
            }}
          />
          <Collapse in={options.paletteType !== "octree"}>
            <SliderParameter
              text="Colour Count"
              value={options.colorCount}
              onChange={v => setOptions(["colorCount", v])}
              range={[8, 64]}
              step={4}
              marks
            />
          </Collapse>
          <RadioParameter<DitherMethod>
            text="Dithering Method"
            value={options.ditherMethod}
            onChange={v => setOptions(["ditherMethod", v])}
            labels={{
              "floyd-steinberg": "Floyd-Steinberg (nerfed)",
              "aktinson": "Aktinson",
              "none": "None"
            }}
          />
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
