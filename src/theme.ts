import { createMuiTheme, Theme } from '@material-ui/core/styles';

export default function makeTheme(prefersDarkMode: boolean): Theme {
  console.log(prefersDarkMode);
  return createMuiTheme({
    palette: {
      type: prefersDarkMode ? "dark" : "light"
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "html, body": {
            overflow: "hidden"
          }
        }
      }
    }
  });
}
