import React, { useEffect, useState } from "react";
import { Button, Container, createStyles, Drawer, List, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { getImageFromFile } from "../src/image";
import Canvas from "../src/Canvas";

const drawerWidth = 320;

const useStyles = makeStyles(theme => createStyles({
  app: {
    display: "flex",
    backgroundColor: theme.palette.background.default
  },
  main: {
    width: `calc(100% - ${drawerWidth}px)`,
    height: "100vh",
    padding: 32
  },
  drawer: {
    width: drawerWidth
  },
  button: {
    flexGrow: 1
  }
}));

export default function App() {
  const styles = useStyles();
  const [filename, setFilename] = useState<string | undefined>();
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [inputData, setInputData] = useState<ImageData | undefined>()

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
        {image ? <Canvas image={image} fetchImageData={setInputData} /> : false}
      </main>
      <Drawer variant="permanent" open classes={{ paper: styles.drawer }} anchor="right">
        <List disablePadding>
          <ListItem>
            <ListItemText
              primary="Pixelate"
              secondary={filename ?? "Load an image to continue"}
              primaryTypographyProps={{ variant: "h6" }}
            />
          </ListItem>
          <ListItem>
            <Button component="label" variant="outlined" className={styles.button} style={{ marginRight: 8 }}>
              Load Image
              <input type="file" accept="image/*" hidden onChange={handleInputChange} />
            </Button>
            <Button variant="contained" color="primary" className={styles.button}>Apply</Button>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
