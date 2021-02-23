import Head from "next/head";
import React, { FunctionComponent, ReactNode } from "react";
import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PhaseBanner } from "./PhaseBanner";

interface LayoutProps {
  children: ReactNode;
  showCookieBanner: boolean;
  head?: ReactNode;
  navigation?: ReactNode;
}

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
  showCookieBanner,
  head = <BeaconRegistrationHead />,
  navigation = null,
}: LayoutProps): JSX.Element => {
  let cookieBanner: ReactNode;
  if (showCookieBanner) {
    cookieBanner = <CookieBanner />;
  }
  return (
    <>
      {head}
      {cookieBanner}
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

      <div className="govuk-width-container">
        {navigation}

        <main id="main-content" className="govuk-main-wrapper">
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
};

const BeaconRegistrationHead: FunctionComponent = () => (
  <Head>
    <title>
      Beacon Registration Service - Register a new 406 MHz distress beacon
    </title>
  </Head>
);
