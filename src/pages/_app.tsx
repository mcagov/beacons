import React, { FunctionComponent, useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.scss";

const MyApp: FunctionComponent<AppProps> = ({
  Component,
  pageProps,
}: AppProps) => {
  useEffect(() => {
    document.body.className = document.body.className
      ? document.body.className + " js-enabled"
      : "js-enabled";
    // TODO investigate alternative syntax to avoid linter catching require()
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const GOVUKFrontend = require("govuk-frontend");

    GOVUKFrontend.initAll();
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
