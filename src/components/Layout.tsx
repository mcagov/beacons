import Head from "next/head";
import React, { FunctionComponent, ReactNode } from "react";
import { FeedbackURLs } from "../lib/urls";
import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PhaseBanner } from "./PhaseBanner";

interface LayoutProps {
  children: ReactNode;
  showCookieBanner?: boolean;
  head?: ReactNode;
  navigation?: ReactNode;
  title: string;
  pageHasErrors?: boolean;
}

interface BeaconRegistrationHeadProps {
  title: string;
  pageHasErrors: boolean;
}

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
  title,
  pageHasErrors = false,
  head = <BeaconRegistrationHead title={title} pageHasErrors={pageHasErrors} />,
  navigation = null,
  showCookieBanner = true,
}: LayoutProps): JSX.Element => {
  let cookieBanner: ReactNode;
  if (showCookieBanner) {
    cookieBanner = <CookieBanner />;
  }
  return (
    <>
      {head}
      {cookieBanner}
      <a href="#main-content" className="govuk-skip-link">
        Skip to main content
      </a>
      <Header
        serviceName={"Maritime and Coastguard Agency: Register a beacon"}
        homeLink={"/"}
      />
      <PhaseBanner phase="BETA">
        This is a new service – your{" "}
        <a className="govuk-link" href={FeedbackURLs.feedback}>
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

export const BeaconRegistrationHead: FunctionComponent<BeaconRegistrationHeadProps> =
  ({ title, pageHasErrors }: BeaconRegistrationHeadProps) => {
    const headTitle = pageHasErrors ? `Error: ${title}` : title;

    return (
      <Head>
        <title>{`${headTitle} - Beacon Registration Service - GOV.UK`}</title>
      </Head>
    );
  };
