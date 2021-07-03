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
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "html, body, #__next": {
            width: "100%",
            height: "100%",
            overflow: "hidden"
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
