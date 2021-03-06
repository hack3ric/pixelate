import { Collapse, ListItem, TextField } from "@material-ui/core";
import React from "react";
import { DitherMethod } from "../../image/apply-color";
import { PaletteType } from "../../image/palette";
import { Dimensions } from "../../image/resize";
import { Options, OptionsAction } from "../../options";
import { SliderParameter, RadioParameter, useSidebarStyles, ParameterText, SidebarList } from "./common";

export interface ParametersProps {
  dimensions?: Dimensions;
  options: Options;
  setOptions: (...v: OptionsAction) => void;
}

export default function Parameters({ dimensions, options, setOptions }: ParametersProps) {
  return (
    <SidebarList label="Parameters">
      <ResizeParameter
        dimensions={dimensions}
        setOptions={setOptions}
      />
      <RadioParameter<PaletteType>
        text="Palette Type"
        value={options.paletteType}
        onChange={v => setOptions("paletteType", v)}
        labels={{
          "octree": "Octree",
          "median-cut-variance": "Median Cut (variance)",
          "median-cut-range": "Median Cut (range)"
        }}
      />
      <Collapse in={options.paletteType !== "octree"}>
        <SliderParameter
          text="Colour Count"
          value={options.colorCount}
          onChange={v => setOptions("colorCount", v)}
          range={[8, 64]}
          step={4}
          marks
        />
      </Collapse>
      <RadioParameter<DitherMethod>
        text="Dithering Method"
        value={options.ditherMethod}
        onChange={v => setOptions("ditherMethod", v)}
        labels={{
          "floyd-steinberg": "Floyd-Steinberg (nerfed)",
          "aktinson": "Aktinson",
          "none": "None"
        }}
      />
    </SidebarList>
  );
}

interface ResizeParameterProps {
  setOptions: (...v: OptionsAction) => void;
  dimensions?: { width: number, height: number }; // Also acts as enable/disable toggle
}

function ResizeParameter({ setOptions, dimensions }: ResizeParameterProps) {
  const styles = useSidebarStyles();

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.select();
  }

  function getHandleChange(dimension: "width" | "height") {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setOptions("dimension", dimension);
      const value = parseInt(e.currentTarget.value);
      const validValue = isNaN(value) ? 0 : value < 0 ? -value : value;
      setOptions("size", validValue);
    }
  }

  return (
    <ListItem className={styles.parameter}>
      <ParameterText>Image Size</ParameterText>
      <div style={{ display: "flex" }}>
        <TextField
          disabled={dimensions == null}
          label="Width"
          InputProps={{ type: "number" }}
          value={dimensions?.width.toString() ?? 0}
          onFocus={handleFocus}
          onChange={getHandleChange("width")}
          style={{ marginRight: 8 }}
        />
        <TextField
          disabled={dimensions == null}
          label="Height"
          InputProps={{ type: "number" }}
          value={dimensions?.height.toString() ?? 0}
          onFocus={handleFocus}
          onChange={getHandleChange("height")}
        />
      </div>
    </ListItem>
  )
}
