import React, { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, createStyles, Drawer, Fab, Hidden, makeStyles, Snackbar } from "@material-ui/core";
import { getImageFromFile } from "../image";
import Canvas from "./Canvas";
import { ChevronLeftRounded } from "@material-ui/icons";
import Welcome from "./Welcome";
import { ImageWorkerApi } from "../image/image.worker";
import * as Comlink from "comlink";
import Head from "next/head";
import Parameters from "./sidebar/Parameters";
import { DitherMethod, ditherMethods } from "../image/dither";
import Export from "./sidebar/Export";
import { PaletteType } from "../image/palette";
import useLocalStorage from "../use-local-storage";
import { SidebarPaper } from "./sidebar/common";

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
    paddingRight: 8,
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
    boxShadow: "none"
  },
  expandDrawerButton: {
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

  const [mobileOpenDrawer, setMobileOpenDrawer] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const [size, setSize] = useLocalStorage("size", 512);
  const [colorCount, setColorCount] = useLocalStorage("colorCount", 24);
  const [paletteType, setPaletteType] = useLocalStorage<PaletteType>("paletteType", "median-cut-variance");
  const [ditherMethod, setDitherMethod] = useLocalStorage<DitherMethod>("ditherMethod", "eric");
  const [pixelScale, setPixelScale] = useLocalStorage("pixelScale", 4);

  useEffect(() => {
    const worker = new Worker(
      new URL("../image/image.worker.ts", import.meta.url),
      { type: "module" }
    );
    imageWorker.current = Comlink.wrap<ImageWorkerApi>(worker);
    return () => worker.terminate();
  }, []);

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || !event.target.files[0]) return;
    const file = event.target.files[0];
    setFilename(file.name);
    setImage(await getImageFromFile(file));
    // setInputData(undefined);
    setOutputData(undefined);
  }

  async function handleApply() {
    if (!inputData || !imageWorker.current || generating) return;
    setGenerating(true);
    const output = await imageWorker.current.run(
      inputData,
      size,
      colorCount,
      ditherMethods[ditherMethod],
      paletteType
    );
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
      <Button color="secondary" onClick={handleApply} disabled={generating || !inputData}>Apply</Button>
    </SidebarPaper>
    <Parameters
      size={size} onSizeChange={setSize}
      colorCount={colorCount} onColorCountChange={setColorCount}
      paletteType={paletteType} onPaletteTypeChange={setPaletteType}
      ditherMethod={ditherMethod} onDitherMethodChange={setDitherMethod}
    />
    <Export
      imageWorker={imageWorker}
      filename={filename}
      outputData={outputData}
      pixelScale={pixelScale}
      onPixelScaleChange={setPixelScale}
    />
  </>;

  return (
    <div className={styles.app}>
      <Head>
        <title>{filename ? `${filename} - Pixelate` : "Pixelate"}</title>
      </Head>
      <main className={styles.main}>
        {image
          ? <Canvas
              image={outputData && !showOriginal ? outputData : image}
              fetchImageData={showOriginal ? undefined : setInputData}
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
            />
          : <Welcome />}
      </main>
      <Hidden smDown implementation="js">
        <Drawer
          variant="permanent"
          open
          classes={{ paper: styles.drawer }}
          anchor="right"
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          open={mobileOpenDrawer}
          PaperProps={{ onClick: handleDrawerClick }}
          onClose={handleDrawerToggle}
          classes={{ paper: styles.drawer }}
          anchor="right"
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden mdUp implementation="css">
        {mobileOpenDrawer
          ? false
          : <Fab
              className={styles.expandDrawerButton}
              color="secondary"
              onClick={handleDrawerToggle}
            >
              <ChevronLeftRounded />
            </Fab>}
      </Hidden>
      <Snackbar
        open={generating}
        message="Generating"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        action={<CircularProgress color="secondary" size="1rem" style={{ marginRight: 8 }} />}
      />
    </div>
  );
}
