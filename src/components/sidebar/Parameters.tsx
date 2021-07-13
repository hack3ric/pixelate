import { Collapse, List, ListItem, ListItemText, TextField } from "@material-ui/core";
import { ExpandLessRounded, ExpandMoreRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { DitherMethod } from "../../image/apply-color";
import { PaletteType } from "../../image/palette";
import { Options, OptionsAction } from "../../options";
import { SliderParameter, SidebarPaper, RadioParameter, useSidebarStyles, ParameterText } from "./common";

export interface ParametersProps {
  input?: ImageData;
  options: Options;
  setOptions: (v: OptionsAction) => void;
}

export default function Parameters({ input, options, setOptions }: ParametersProps) {
  const [open, setOpen] = useState(true);
  const styles = useSidebarStyles();
  let aspectRatio: number | undefined;
  if (input) {
    aspectRatio = input.width / input.height;
  } else {
    aspectRatio = 4/3;
  }

  return (
    <SidebarPaper>
      <List disablePadding>
        <ListItem dense button onClick={() => setOpen(!open)}>
          <ListItemText primary="Parameters" />
          {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </ListItem>
        <Collapse in={open}>
          {/* <SliderParameter
            text="Image Size"
            value={options.size}
            onChange={v => setOptions(["size", v])}
            range={[128, 768]}
            step={64}
            marks
          /> */}
          <ListItem className={styles.parameter}>
            <ParameterText>Image Size</ParameterText>
            <div style={{ display: "flex" }}>
              <TextField
                label="Width"
                value={options.dimension === "width" ? options.size.toString() : Math.floor(options.size * aspectRatio).toString()}
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                  setOptions(["dimension", "width"]);
                  const value = parseInt(e.currentTarget.value);
                  const validValue = isNaN(value) ? 0 : value < 0 ? -value : value;
                  setOptions(["size", validValue]);
                }}
                InputProps={{ type: "number" }}
                style={{ marginRight: 8 }}
              />
              <TextField
                label="Height"
                value={options.dimension === "height" ? options.size.toString() : Math.floor(options.size / aspectRatio).toString()}
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                  setOptions(["dimension", "height"]);
                  const value = parseInt(e.currentTarget.value);
                  const validValue = isNaN(value) ? 0 : value < 0 ? -value : value;
                  setOptions(["size", validValue]);
                }}
              />
            </div>
          </ListItem>
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
