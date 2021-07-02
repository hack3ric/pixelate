import { createMuiTheme, Theme } from '@material-ui/core/styles';

export default function makeTheme(prefersDarkMode: boolean): Theme {
  return createMuiTheme({
    palette: {
      type: prefersDarkMode ? "dark" : "light"
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
