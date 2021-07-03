import { Collapse, createStyles, List, ListItem, ListItemText, makeStyles, Slider } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import SidebarPaper from "./SidebarPaper";

const useStyles = makeStyles(theme => createStyles({
  parameter: {
    display: "block"
  }
}));

export interface ParametersProps {
  size: number;
  onSizeChange: (newValue: number) => void;
  colorCount: number,
  onColorCountChange: (newValue: number) => void;
}

function ParameterText(props: { children?: React.ReactNode }) {
  return (
    <ListItemText
      primary={props.children}
      primaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
    />
  );
}

export default function Parameters(props: ParametersProps) {
  const styles = useStyles();
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
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
