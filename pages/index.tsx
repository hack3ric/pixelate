import React, { useEffect, useRef, useState } from "react";
import { Button, Collapse, createStyles, Drawer, Fab, Hidden, List, ListItem, ListItemText, makeStyles, Paper, Slider } from "@material-ui/core";
import { getImageFromFile } from "../src/image";
import Canvas from "../src/components/Canvas";
import { ChevronLeft, ExpandLess, ExpandMore } from "@material-ui/icons";
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
      width: "100%",
      padding: "16px"
    },
    height: "100%",
    padding: "24px 32px"
  },
  drawer: {
    width: drawerWidth,
    background: "transparent",
    border: "none",
    padding: 16,
    [theme.breakpoints.up("md")]: {
      paddingLeft: 0,
    },
    maxWidth: "100%",
    boxShadow: "none"
  },
  paper: {
    padding: "8px 0",
    boxShadow: "none",
    margin: "8px 0",
    [theme.breakpoints.down("sm")]: {
      boxShadow: theme.shadows[2]
    }
  },
  paperOnBackdrop: {
    border: theme.palette.type === "light" ? "1px solid white" : undefined
  },
  parameter: {
    display: "block"
  },
  expandDrawer: {
    position: "absolute",
    top: 8,
    right: 8
  }
}));

export default function App() {
  const styles = useStyles();
  const imageWorker = useRef<Comlink.Remote<ImageWorkerApi>>();

  const [filename, setFilename] = useState<string | undefined>();
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [inputData, setInputData] = useState<ImageData | undefined>();
  const [outputData, setOutputData] = useState<ImageData | undefined>();
  const [openParameters, setOpenParameters] = useState(true);
  const [mobileOpenDrawer, setMobileOpenDrawer] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL("../src/image/worker.ts", import.meta.url), { type: "module" });
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

  const drawer = (type: "permanent" | "temporary") => <>
    <Paper variant="outlined" className={`${styles.paper} ${type === "temporary" ? styles.paperOnBackdrop : ""}`} style={{ padding: 8 }}>
      <Button component="label" style={{ marginRight: 8 }}>
        Load Image
        <input type="file" accept="image/*" hidden onChange={handleInputChange} />
      </Button>
      <Button color="secondary" onClick={handleApply}>Apply</Button>
    </Paper>

    <Paper variant="outlined" className={`${styles.paper} ${type === "temporary" ? styles.paperOnBackdrop : ""}`}>
      <List disablePadding>
        <ListItem button onClick={() => setOpenParameters(!openParameters)} dense>
          <ListItemText primary="Parameters" primaryTypographyProps={{ variant: "body1" }} />
          {openParameters ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openParameters}>
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
    </Paper>
  </>;

  function handleDrawerToggle() {
    setMobileOpenDrawer(v => !v);
  }

  function handleDrawerClick(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) {
      return;
    }
    handleDrawerToggle();
  }

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        {image ? <Canvas
          image={outputData ?? image}
          fetchImageData={setInputData}
        /> : <Welcome />}
      </main>

      <Hidden smDown>
        <Drawer
          variant="permanent"
          open
          classes={{ paper: styles.drawer }}
          anchor="right"
        >
          {drawer("permanent")}
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        {mobileOpenDrawer ? false : <Fab
          className={styles.expandDrawer}
          color="secondary"
          onClick={handleDrawerToggle}
        >
          <ChevronLeft />
        </Fab>}
        <Drawer
          variant="temporary"
          open={mobileOpenDrawer}
          PaperProps={{ onClick: handleDrawerClick }}
          onClose={handleDrawerToggle}
          classes={{ paper: styles.drawer }}
          anchor="right"
        >
          {drawer("temporary")}
        </Drawer>
      </Hidden>
    </div>
  );
}
