import React, { FunctionComponent } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const MyApp: FunctionComponent<AppProps> = ({
  Component,
  pageProps,
}: AppProps) => {
  while (true) {
    Math.max(1, 2);
  }

  return <Component {...pageProps} />;
};

export default MyApp;
