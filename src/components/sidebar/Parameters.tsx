import { Collapse, FormControlLabel, List, ListItem, ListItemText, RadioGroup, Slider, Radio } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import { DitherMethodPreset } from "../../image/dither";
import { useSidebarStyles, ParameterText } from "./common";
import SidebarPaper from "./SidebarPaper";

export interface ParametersProps {
  size: number;
  onSizeChange: (newValue: number) => void;
  colorCount: number,
  onColorCountChange: (newValue: number) => void;
  dither: DitherMethodPreset,
  onDitherChange: (newValue: DitherMethodPreset) => void;
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
              marks={[{ value: 256 }, { value: 512 }, { value: 1024 }]}
              onChange={(_e, newValue) => props.onSizeChange(newValue as number)}
            />
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
              marks={[{ value: 16 }, { value: 32 }, { value: 64 }]}
              onChange={(_e, newValue) => props.onColorCountChange(newValue as number)}
            />
          </ListItem>
          <ListItem className={styles.parameter}>
            <ParameterText>Dither Method</ParameterText>
            <RadioGroup value={props.dither} onChange={(_e, newValue) => props.onDitherChange(newValue as DitherMethodPreset)}>
              <FormControlLabel value="FloydSteinberg" control={<Radio />} label="Floyd-Steinberg" />
              <FormControlLabel value="Aktinson" control={<Radio />} label="Aktinson" />
              <FormControlLabel value="Eric" control={<Radio />} label="hackereric" />
            </RadioGroup>
          </ListItem>
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
