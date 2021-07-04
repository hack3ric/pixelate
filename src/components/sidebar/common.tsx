import { makeStyles, createStyles, ListItemText } from "@material-ui/core";
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
}));

export function ParameterText(props: { children?: React.ReactNode }) {
  return (
    <ListItemText
      primary={props.children}
      primaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
    />
  );
}
