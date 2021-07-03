import React, { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, createStyles, Drawer, Fab, Hidden, makeStyles, Snackbar } from "@material-ui/core";
import { getImageFromFile } from "../src/image";
import Canvas from "../src/components/Canvas";
import { ChevronLeft } from "@material-ui/icons";
import Welcome from "../src/components/Welcome";
import { ImageWorkerApi } from "../src/image/worker";
import * as Comlink from "comlink";
import * as DitherMethods from "../src/image/dither";
import SidebarPaper from "../src/components/SidebarPaper";
import Head from "next/head";
import Parameters from "../src/components/Parameters";

const drawerWidth = 340;

const useStyles = makeStyles(theme => createStyles({
  app: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "100%"
  },
  main: {
    width: `calc(100% - ${drawerWidth}px)`,
    height: "100%",
    padding: 24,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: 8
    }
  },
  drawer: {
    width: drawerWidth,
    maxWidth: "100%",
    background: "transparent",
    border: "none",
    padding: 16,
    boxShadow: "none",
    [theme.breakpoints.up("md")]: {
      paddingLeft: 0
    }
  },
  expandDrawerButton: {
    position: "absolute",
    top: 8,
    right: 8
  },
  snackbarContent: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: "1rem"
  }
}));

export default function App() {
  const styles = useStyles();
  const imageWorker = useRef<Comlink.Remote<ImageWorkerApi>>();

  const [filename, setFilename] = useState<string | undefined>();
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [inputData, setInputData] = useState<ImageData | undefined>();
  const [outputData, setOutputData] = useState<ImageData | undefined>();
  const [mobileOpenDrawer, setMobileOpenDrawer] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [size, setSize] = useState(512);
  const [colorCount, setColorCount] = useState(24);

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
    // setInputData(undefined);
    setOutputData(undefined);
  }

  async function handleApply() {
    if (!inputData || !imageWorker.current || generating) {
      return;
    }

    setGenerating(true);
    const output = await imageWorker.current.apply(inputData, size, colorCount, DitherMethods.FloydSteinberg);
    console.log(output);
    setOutputData(output);
    setGenerating(false);
  }

  function handleDrawerToggle() {
    setMobileOpenDrawer(v => !v);
  }

  function handleDrawerClick(e: React.MouseEvent) {
    if (e.target !== e.currentTarget) {
      return;
    }
    handleDrawerToggle();
  }

  const drawerContent = <>
    <SidebarPaper style={{ padding: 8, display: "flex", alignItems: "center" }}>
      <Button component="label" disabled={generating} style={{ marginRight: 8 }}>
        Load Image
        <input type="file" accept="image/*" hidden onChange={handleInputChange} />
      </Button>
      <Button color="secondary" onClick={handleApply}>Apply</Button>
    </SidebarPaper>
    <Parameters
      size={size} onSizeChange={setSize}
      colorCount={colorCount} onColorCountChange={setColorCount}
    />
  </>;

  return (
    <div className={styles.app}>
      <Head>
        <title>{filename ? `${filename} - Pixelate` : "Pixelate"}</title>
      </Head>

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
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        {mobileOpenDrawer ? false : <Fab
          className={styles.expandDrawerButton}
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
          {drawerContent}
        </Drawer>
      </Hidden>

      <Snackbar
        open={generating}
        ContentProps={{ className: styles.snackbarContent }}
        message="Generating"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        action={<CircularProgress color="secondary" size="1rem" style={{ marginRight: 8 }} />}
      />
    </div>
  );
}
