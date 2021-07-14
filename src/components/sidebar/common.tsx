import { makeStyles, createStyles, ListItemText, ListItem, Mark, Slider, Paper, RadioGroup, FormControlLabel, Radio, List, Collapse } from "@material-ui/core";
import { ExpandLessRounded, ExpandMoreRounded } from "@material-ui/icons";
import React, { useState } from "react";

export const useSidebarStyles = makeStyles(theme => createStyles({
  paper: {
    padding: "8px 0",
    boxShadow: "none",
    margin: "8px 0",
    [theme.breakpoints.down("sm")]: {
      boxShadow: theme.shadows[3],
      border: theme.palette.type === "light" ? "1px solid white" : undefined
    }
  },
  parameter: {
    display: "block"
  }
}), { index: 1 }); // prevent breaking styles in production

export interface SidebarPaperProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function SidebarPaper({ children, style }: SidebarPaperProps) {
  const styles = useSidebarStyles();

  return (
    <Paper
      variant="outlined"
      className={styles.paper}
      style={style}
    >
      {children}
    </Paper>
  );
}

export function ParameterText(props: { children?: React.ReactNode }) {
  return (
    <ListItemText
      primary={props.children}
      primaryTypographyProps={{ variant: "overline", color: "textSecondary" }}
    />
  );
}

export interface SliderParameterProps {
  text: string;
  value: number;
  onChange: (v: number) => void;
  range: [number, number];
  step: number;
  marks?: boolean | Mark[];
}

export function SliderParameter(props: SliderParameterProps) {
  const styles = useSidebarStyles();

  return (
    <ListItem className={styles.parameter}>
      <ParameterText>{props.text}</ParameterText>
      <Slider
        value={props.value}
        onChange={(_e, v) => props.onChange(v as number)}
        min={props.range[0]}
        max={props.range[1]}
        step={props.step}
        marks={props.marks}
        valueLabelDisplay="auto"
      />
    </ListItem>
  );
}

export interface RadioParameterProps<T extends string | number> {
  text: string;
  value: T;
  onChange: (v: T) => void;
  labels: { [key in T]?: string }
}

export function RadioParameter<T extends string | number>(props: RadioParameterProps<T>) {
  const styles = useSidebarStyles();

  return (
    <ListItem className={styles.parameter}>
      <ParameterText>{props.text}</ParameterText>
      <RadioGroup value={props.value} onChange={(_e, v) => props.onChange(v as T)}>
        {Object.keys(props.labels)
          .map(i => (
            <FormControlLabel
              key={i}
              value={i}
              control={<Radio />}
              label={props.labels[i as T]}
            />
          ))}
      </RadioGroup>
    </ListItem>
  );
}

export interface SidebarListProps {
  label: React.ReactNode;
  children?: React.ReactNode;
}

export function SidebarList({ label, children }: SidebarListProps) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarPaper>
      <List disablePadding>
        <ListItem dense button onClick={() => setOpen(!open)}>
          <ListItemText primary={label} />
          {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </ListItem>
        <Collapse in={open}>
          {children}
        </Collapse>
      </List>
    </SidebarPaper>
  );
}
