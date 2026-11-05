import { SessionProvider as AuthProvider } from "next-auth/react";
import { Session } from "next-auth";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { FunctionComponent, useEffect, type JSX } from "react";
import "../styles/globals.scss";

const BeaconRegistrationApp: FunctionComponent<AppProps> = ({
  Component,
  pageProps,
}: AppProps<{ session: Session }>): JSX.Element => {
  useEffect(() => {
    document.body.className +=
      " js-enabled" +
      ("noModule" in HTMLScriptElement.prototype
        ? " govuk-frontend-supported"
        : "");
    // TODO investigate alternative syntax to avoid linter catching require()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const GOVUKFrontend = require("govuk-frontend");

    GOVUKFrontend.initAll();
  }, []);

  return (
    <>
      <Head>
        <GovUKMetadata />
      </Head>

      <AuthProvider session={pageProps.session}>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};

const GovUKMetadata: FunctionComponent = () => (
  <>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <meta charSet="utf-8" />
    <meta name="theme-color" content="#1d70b8" />

    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

    <link rel="icon" sizes="48x48" href="/assets/images/favicon.ico" />
    <link
      rel="icon"
      sizes="any"
      href="/assets/images/favicon.svg"
      type="image/svg+xml"
    />
    <link
      rel="mask-icon"
      href="/assets/images/govuk-icon-mask.svg"
      color="#1d70b8"
    />
    <link rel="apple-touch-icon" href="/assets/images/govuk-icon-180.png" />
    <link rel="manifest" href="/assets/manifest.json" />

    <meta
      property="og:image"
      content="/assets/images/govuk-opengraph-image.png"
    />
  </>
);

export default BeaconRegistrationApp;
