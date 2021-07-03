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
            <ListItemText
              primary="Image Size"
              primaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
            />
            <Slider
              color="secondary"
              value={props.size}
              min={256}
              max={1024}
              step={128}
              valueLabelDisplay="auto"
              onChange={(_e, newValue) => props.onSizeChange(newValue as number)}
            />
          </ListItem>
          <ListItem className={styles.parameter}>
            <ListItemText
              primary="Colours"
              primaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
            />
            <Slider
              color="secondary"
              value={props.colorCount}
              min={8}
              max={64}
              step={8}
              valueLabelDisplay="auto"
              onChange={(_e, newValue) => props.onColorCountChange(newValue as number)}
            />
          </ListItem>
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
