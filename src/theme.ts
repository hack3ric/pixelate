import { createMuiTheme, Theme } from '@material-ui/core/styles';

export default function makeTheme(prefersDarkMode: boolean): Theme {
  console.log(prefersDarkMode);
  return createMuiTheme({
    palette: {
      type: prefersDarkMode ? "dark" : "light",
      // secondary: {
      //   main: "#00ffff"
      // }
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
