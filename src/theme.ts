import { cyan } from "@material-ui/core/colors";
import { createTheme, Theme } from "@material-ui/core/styles";

export default function makeTheme(prefersDarkMode: boolean): Theme {
  const type = prefersDarkMode ? "dark" : "light";

  return createTheme({
    palette: {
      type,
      primary: { main: cyan[500], contrastText: type === "dark" ? "#000" : "#fff" },
      secondary: { main: cyan[500], contrastText: type === "dark" ? "#000" : "#fff" },
      background: {
        default: type === "dark" ? "#101010" : "#fafafa",
        paper: type === "dark" ? "#202020" : "#fff"
      }
    },
    typography: {
      fontFamily: "Rubik, -apple-system, BlinkMacSystemFont, " +
        "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', " +
        "'Helvetica Neue', sans-serif",
      overline: {
        lineHeight: 2
      }
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "html, body, #__next": {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            userSelect: "none"
          },
          "input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0
          },
          "input[type=number]": {
            MozAppearance: "textfield"
          }
        }
      },
      MuiPaper: {
        rounded: {
          borderRadius: 8
        }
      }
    }
  });
}
