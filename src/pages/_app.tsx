import React, { FunctionComponent, useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.scss";
import Head from "next/head";
import { Header } from "../components/Header";
import PhaseBanner from "../components/PhaseBanner";
import { Footer } from "../components/Footer";

const BeaconRegistrationApp: FunctionComponent<AppProps> = ({
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

  return (
    <>
      <Head>
        <GovUKMetadata />
      </Head>
      <a href="#main-content" className="govuk-skip-link" role="main">
        Skip to main content
      </a>
      <Header
        serviceName={"Maritime and Coastguard Agency: Register a beacon"}
        homeLink={"#"}
      />
      <PhaseBanner phase="BETA">
        This is a new service – your{" "}
        <a className="govuk-link" href="#">
          feedback
        </a>{" "}
        will help us to improve it.
      </PhaseBanner>
      <div className="govuk-width-container ">
        <main id="main-content" className="govuk-main-wrapper">
          <Component {...pageProps} />
        </main>
      </div>
      <Footer />
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
    <meta name="theme-color" content="#0b0c0c" />

    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

    <link
      rel="shortcut icon"
      sizes="16x16 32x32 48x48"
      href="/assets/images/favicon.ico"
      type="image/x-icon"
    />
    <link
      rel="mask-icon"
      href="/assets/images/govuk-mask-icon.svg"
      color="#0b0c0c"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/assets/images/govuk-apple-touch-icon-180x180.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="167x167"
      href="/assets/images/govuk-apple-touch-icon-167x167.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href="/assets/images/govuk-apple-touch-icon-152x152.png"
    />
    <link
      rel="apple-touch-icon"
      href="/assets/images/govuk-apple-touch-icon.png"
    />

    <meta
      property="og:image"
      content="/assets/images/govuk-opengraph-image.png"
    />
  </>
);

export default BeaconRegistrationApp;
