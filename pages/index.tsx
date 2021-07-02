import React, { useEffect, useState } from "react";
import { Button, Collapse, Container, createStyles, Divider, Drawer, List, ListItem, ListItemText, makeStyles, Paper, Slider, Typography } from "@material-ui/core";
import { getImageFromFile } from "../src/image";
import Canvas from "../src/Canvas";
import { ExpandLess } from "@material-ui/icons";
import Welcome from "../src/Welcome";

const drawerWidth = 320;

const useStyles = makeStyles(theme => createStyles({
  app: {
    display: "flex",
    backgroundColor: theme.palette.background.default
  },
  main: {
    width: `calc(100% - ${drawerWidth}px)`,
    height: "100vh",
    padding: "24px 32px"
  },
  drawer: {
    width: drawerWidth,
    background: "transparent",
    border: "none",
    padding: 16,
    paddingLeft: 0
  },
  paper: {
    padding: "8px 0",
    borderRadius: 8,
    boxShadow: "none",
    margin: "8px 0"
  },
  parameter: {
    display: "block"
  }
}));

export default function App() {
  const styles = useStyles();
  const [filename, setFilename] = useState<string | undefined>();
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [inputData, setInputData] = useState<ImageData | undefined>();
  const [p, setP] = useState(true);

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }
    const file = event.target.files[0];
    setFilename(file.name);
    setImage(await getImageFromFile(file));
  }

  useEffect(() => console.log(inputData), [inputData]);

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        {image
          ? <Canvas image={image} fetchImageData={setInputData} />
          : <Welcome />}
      </main>

      <Drawer variant="permanent" open classes={{ paper: styles.drawer }} anchor="right">
        <Paper variant="outlined" className={styles.paper} style={{ padding: 8 }}>
          <Button component="label" style={{ marginRight: 8 }}>
            Load Image
            <input type="file" accept="image/*" hidden onChange={handleInputChange} />
          </Button>
          <Button color="secondary">Apply</Button>
        </Paper>

        <Paper variant="outlined" className={styles.paper}>
          <List disablePadding>
            <ListItem button onClick={() => setP(!p)} dense>
              <ListItemText primary="Parameters" primaryTypographyProps={{ variant: "body1" }} />
              <ExpandLess />
            </ListItem>
            <Collapse in={p}>
              <ListItem className={styles.parameter}>
                <ListItemText primary="Scale" primaryTypographyProps={{ variant: "body2", color: "textSecondary" }} />
                <Slider color="secondary" />
              </ListItem>
              <ListItem className={styles.parameter}>
                <ListItemText primary="Colours" primaryTypographyProps={{ variant: "body2", color: "textSecondary" }} />
                <Slider color="secondary" />
              </ListItem>
            </Collapse>
          </List>
        </Paper>
      </Drawer>
    </div>
  );
}
