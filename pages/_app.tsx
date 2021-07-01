import React from "react";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../src/theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
