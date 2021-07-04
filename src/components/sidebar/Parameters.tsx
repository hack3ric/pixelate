import { Collapse, FormControlLabel, List, ListItem, ListItemText, RadioGroup, Slider, Radio } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import { DitherMethod } from "../../image/dither";
import { PaletteType } from "../../image/palette";
import { useSidebarStyles, ParameterText } from "./common";
import SidebarPaper from "./SidebarPaper";

export interface ParametersProps {
  size: number;
  paletteType: PaletteType,
  colorCount: number,
  dither: DitherMethod,
  onSizeChange: (v: number) => void;
  onPaletteTypeChange: (v: PaletteType) => void;
  onColorCountChange: (v: number) => void;
  onDitherChange: (v: DitherMethod) => void;
}

function marks(...m: number[]): { value: number }[] {
  return m.map(i => ({ value: i }));
}

export default function Parameters(props: ParametersProps) {
  const styles = useSidebarStyles();
  const [open, setOpen] = useState(true);

  return (
    <SidebarPaper>
      <List disablePadding>
        <ListItem button onClick={() => setOpen(!open)}>
          <ListItemText primary="Parameters" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open}>
          <ListItem className={styles.parameter}>
            <ParameterText>Image Size</ParameterText>
            <Slider
              color="secondary"
              value={props.size}
              min={128}
              max={1024}
              step={64}
              valueLabelDisplay="auto"
              marks={marks(128, 256, 384, 512, 640, 768, 896, 1024)}
              onChange={(_e, v) => props.onSizeChange(v as number)}
            />
          </ListItem>
          <ListItem className={styles.parameter}>
            <ParameterText>Palette Generating Method</ParameterText>
            <RadioGroup value={props.paletteType} onChange={(_e, v) => props.onPaletteTypeChange(v as PaletteType)}>
              <FormControlLabel value="median-cut-variance" control={<Radio />} label="Median Cut (Variance)" />
              <FormControlLabel value="median-cut-range" control={<Radio />} label="Median Cut (Range)" />
            </RadioGroup>
          </ListItem>
          <ListItem className={styles.parameter}>
            <ParameterText>Colour Count</ParameterText>
            <Slider
              color="secondary"
              value={props.colorCount}
              min={8}
              max={64}
              step={4}
              valueLabelDisplay="auto"
              marks={marks(8, 16, 24, 32, 40, 48, 56, 64)}
              onChange={(_e, v) => props.onColorCountChange(v as number)}
            />
          </ListItem>
          <ListItem className={styles.parameter}>
            <ParameterText>Dither Method</ParameterText>
            <RadioGroup value={props.dither} onChange={(_e, v) => props.onDitherChange(v as DitherMethod)}>
              <FormControlLabel value="FloydSteinberg" control={<Radio />} label="Floyd-Steinberg" />
              <FormControlLabel value="Aktinson" control={<Radio />} label="Aktinson" />
              <FormControlLabel value="Eric" control={<Radio />} label="hackereric" />
              <FormControlLabel value="None" control={<Radio />} label="None" />
            </RadioGroup>
          </ListItem>
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
