import React, { FunctionComponent, ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PhaseBanner } from "./PhaseBanner";

interface LayoutProps {
  children: ReactNode;
  breadcrumbs?: ReactNode;
}

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
  breadcrumbs,
}: LayoutProps): JSX.Element => (
  <>
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
      {breadcrumbs}

      <main id="main-content" className="govuk-main-wrapper">
        {children}
      </main>
    </div>

    <Footer />
  </>
);
