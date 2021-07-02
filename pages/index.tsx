import React, { useEffect, useRef, useState } from "react";
import { Button, Collapse, createStyles, Drawer, List, ListItem, ListItemText, makeStyles, Paper, Slider } from "@material-ui/core";
import { getImageFromFile } from "../src/image";
import Canvas from "../src/components/Canvas";
import { ExpandLess } from "@material-ui/icons";
import Welcome from "../src/components/Welcome";
import { ImageWorkerApi } from "../src/image/worker";
import * as Comlink from "comlink";
import * as DitherMethods from "../src/image/dither";

const drawerWidth = 320;

const useStyles = makeStyles(theme => createStyles({
  app: {
    display: "flex",
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "100%"
  },
  main: {
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    height: "100%",
    padding: "24px 32px"
  },
  drawer: {
    // [theme.breakpoints.down("sm")]: {
    //   display: "none"
    // },
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
  console.log(`Browser: ${process.browser}`)

  const styles = useStyles();
  const [filename, setFilename] = useState<string | undefined>();
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [inputData, setInputData] = useState<ImageData | undefined>();
  const [outputData, setOutputData] = useState<ImageData | undefined>();
  const [p, setP] = useState(true);
  const imageWorker = useRef<Comlink.Remote<ImageWorkerApi>>();

  useEffect(() => {
    const worker = new Worker(new URL("../src/image/worker.ts", import.meta.url), { type: "module" })
    imageWorker.current = Comlink.wrap<ImageWorkerApi>(worker);
    return () => worker.terminate();
  }, []);

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }
    const file = event.target.files[0];
    setFilename(file.name);
    setImage(await getImageFromFile(file));
    setInputData(undefined);
    setOutputData(undefined);
  }

  async function handleApply() {
    if (!inputData || !imageWorker.current) {
      return;
    }
    const output = await imageWorker.current.apply(inputData, 16, 24, DitherMethods.FloydSteinberg);
    console.log(output);
    setOutputData(output);
  }

  useEffect(() => console.log(inputData), [inputData]);

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        {image
          ? <Canvas image={outputData ?? image} fetchImageData={setInputData} />
          : <Welcome />}
      </main>

      <Drawer variant="permanent" open classes={{ paper: styles.drawer }} anchor="right">
        <Paper variant="outlined" className={styles.paper} style={{ padding: 8 }}>
          <Button component="label" style={{ marginRight: 8 }}>
            Load Image
            <input type="file" accept="image/*" hidden onChange={handleInputChange} />
          </Button>
          <Button color="secondary" onClick={handleApply}>Apply</Button>
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
