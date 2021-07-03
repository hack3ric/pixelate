import { createStyles, makeStyles, Paper } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => createStyles({
  paper: {
    padding: "8px 0",
    boxShadow: "none",
    margin: "8px 0",
    [theme.breakpoints.down("sm")]: {
      boxShadow: theme.shadows[2],
      border: theme.palette.type === "light" ? "1px solid white" : undefined
    }
  }
}));

export interface SidebarPaperProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SidebarPaper({ children, style }: SidebarPaperProps) {
  const styles = useStyles();

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
