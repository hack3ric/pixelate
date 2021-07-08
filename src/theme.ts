import { createMuiTheme, Theme } from '@material-ui/core/styles';

export default function makeTheme(prefersDarkMode: boolean): Theme {
  const type = prefersDarkMode ? "dark" : "light";

  return createMuiTheme({
    palette: {
      type,
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
          }
        }
      },
      MuiPaper: {
        rounded: {
          borderRadius: 8
        }
      },
      MuiSnackbarContent: {
        root: {
          borderRadius: 8,
          backgroundColor: type === "dark" ? "#202020" : "#fff",
          color: type === "dark" ? "#fff" : "rgba(0, 0, 0, 0.87)",
          fontSize: "1rem"
        }
      }
    }
  });
}
