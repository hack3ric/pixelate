import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@material-ui/core";
import makeTheme from "../src/theme";
import { SnackbarProvider } from "notistack";

export default function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", { noSsr: true });
  const theme = useMemo(() => makeTheme(prefersDarkMode), [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
