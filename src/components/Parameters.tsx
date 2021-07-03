import { Collapse, createStyles, List, ListItem, ListItemText, makeStyles, Slider } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import SidebarPaper from "./SidebarPaper";

const useStyles = makeStyles(theme => createStyles({
  parameter: {
    display: "block"
  }
}));

export default function Parameters() {
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
              primary="Scale"
              primaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
            />
            <Slider color="secondary" />
          </ListItem>
          <ListItem className={styles.parameter}>
            <ListItemText
              primary="Colours"
              primaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
            />
            <Slider color="secondary" />
          </ListItem>
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
