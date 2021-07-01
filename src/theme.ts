import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: "dark"
  },
  // overrides: {
  //   MuiCssBaseline: {
  //     "@global": {
  //       "html, body": {
  //         overflow: "hidden"
  //       }
  //     }
  //   }
  // }
});

export default theme;
