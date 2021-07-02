import { createStyles, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => createStyles({
  welcome: {
    width: "100%",
    height: "100%",
    border: `12px dashed ${theme.palette.divider}`,
    // borderRadius: 8, // buggy on firefox
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  typography: {
    fontSize: 56,
    fontWeight: "bold",
    color: theme.palette.divider
  }
}));

export default function Welcome() {
  const styles = useStyles();

  return (
    <div className={styles.welcome}>
      <div>
      <Typography className={styles.typography}>Load an image to continue</Typography>
      </div>
    </div>
  );
}
