import { createStyles, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => createStyles({
  welcome: {
    width: "100%",
    height: "100%",
    border: "12px dashed lightgrey",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  typography: {
    fontSize: 56,
    fontWeight: "bold",
    color: "lightgrey"
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
