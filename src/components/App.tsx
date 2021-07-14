import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, CircularProgress, createStyles, Drawer, Fab, Hidden, makeStyles } from "@material-ui/core";
import { getImageFromFile } from "../image/util";
import Canvas from "./Canvas";
import { ChevronLeftRounded } from "@material-ui/icons";
import Welcome from "./Welcome";
import { ImageWorkerApi } from "../image/image.worker";
import * as Comlink from "comlink";
import Head from "next/head";
import Parameters from "./sidebar/Parameters";
import Export from "./sidebar/Export";
import { SidebarPaper } from "./sidebar/common";
import { ditherMethods } from "../image/apply-color";
import { useSnackbar } from "notistack";
import { useOptions } from "../options";
import { Dimensions } from "../image/resize";

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
  },
  snackbarRoot: {
    borderRadius: 8,
    backgroundColor: theme.palette.type === "dark" ? "#202020" : "#fff",
    color: theme.palette.type === "dark" ? "#fff" : "rgba(0, 0, 0, 0.87)",
    fontSize: "1rem"
  }
}));

export default function App() {
  const styles = useStyles();
  const imageWorker = useRef<Comlink.Remote<ImageWorkerApi>>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [filename, setFilename] = useState<string | undefined>();
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [inputData, setInputData] = useState<ImageData | undefined>();
  const [outputData, setOutputData] = useState<ImageData | undefined>();

  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [options, setOptions] = useOptions();

  const dimensions: Dimensions | undefined = useMemo(() => {
    const size = options.size;
    if (!image) {
      return undefined;
    } else {
      const aspectRatio = image.width / image.height;
      if (options.dimension === "width") {
        return {
          width: size,
          height: Math.round(size / aspectRatio)
        };
      } else {
        return {
          width: Math.round(size * aspectRatio),
          height: size
        };
      }
    }
  }, [options.size, options.dimension, image]);

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
    try {
      setImage(await getImageFromFile(file));
      setFilename(file.name);
      // setInputData(undefined);
      setOutputData(undefined);
    } catch (err) {
      event.target.value = "";
      enqueueSnackbar("Failed loading image", {
        variant: "error",
        preventDuplicate: false
      });
    }
  }

  async function handleApply() {
    if (!inputData || !dimensions || !imageWorker.current || generating) return;
    setGenerating(true);
    const snackbarKey = enqueueSnackbar("Generating", {
      persist: true,
      action: <CircularProgress color="secondary" size="1rem" style={{ marginRight: 8 }} />,
      className: styles.snackbarRoot
    });
    const output = await imageWorker.current.run(
      inputData,
      dimensions,
      options.colorCount,
      ditherMethods[options.ditherMethod],
      options.paletteType
    );
    closeSnackbar(snackbarKey);
    setOutputData(output);
    setGenerating(false);
    setOpenMobileDrawer(false);
  }

  function handleDrawerToggle() {
    setOpenMobileDrawer(v => !v);
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
      <Button color="primary" onClick={handleApply} disabled={generating || !inputData}>Apply</Button>
    </SidebarPaper>
    <Parameters
      options={options}
      setOptions={setOptions}
      dimensions={dimensions}
    />
    <Export
      imageWorker={imageWorker}
      filename={filename}
      outputData={outputData}
      pixelScale={options.pixelScale}
      onPixelScaleChange={v => setOptions("pixelScale", v)}
      dimensions={dimensions}
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
          open={openMobileDrawer}
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
        {openMobileDrawer
          ? false
          : <Fab
              className={styles.expandDrawerButton}
              color="secondary"
              onClick={handleDrawerToggle}
            >
              <ChevronLeftRounded />
            </Fab>}
      </Hidden>
    </div>
  );
}
