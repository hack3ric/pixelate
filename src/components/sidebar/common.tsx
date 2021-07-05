import { makeStyles, createStyles, ListItemText, ListItem, Mark, Slider, Paper } from "@material-ui/core";
import React from "react";

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

export function ParameterText(props: { children?: React.ReactNode }) {
  return (
    <ListItemText
      primary={props.children}
      primaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
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
        color="secondary"
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
