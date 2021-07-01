import React, { useEffect, useState } from "react";
import { Button, Container, createStyles, makeStyles, Typography } from "@material-ui/core";
import { getImageFromFile } from "../src/image";
import Canvas from "../src/Canvas";

const useStyles = makeStyles(theme => createStyles({
  app: {
    backgroundColor: theme.palette.background.default,
    padding: "16px 0"
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
      <Container maxWidth="md">
        <div style={{ marginBottom: 16 }}>
          <Button component="label" variant="outlined" style={{ marginRight: 8 }}>
            Load Image
            <input type="file" accept="image/*" hidden onChange={handleInputChange} />
          </Button>
          <Button variant="contained" color="primary">Apply</Button>
        </div>
        <Typography>{filename ?? "Load an image to continue"}</Typography>
        {image ? <Canvas image={image} fetchImageData={setInputData} /> : false}
      </Container>
    </div>
  );
}
