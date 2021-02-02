import React, { FunctionComponent } from "react";
import Head from "next/head";
import Aside from "../components/Aside";
import { StartButton } from "../components/Button";

const ServiceStartPage: FunctionComponent = () => (
  <>
    <Head>
      <title>
        Beacon Registration Service - Register a new 406 MHz distress beacon
      </title>
    </Head>

    <Header />

    <Body />
  </>
);

const Header: FunctionComponent = () => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <h1 className="govuk-heading-l">Register a UK 406 MHz beacon</h1>
    </div>
  </div>
);

const Body: FunctionComponent = () => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <AboutTheService />

      <StartButton />

      <OtherWaysToAccessTheService />
    </div>

    <div className="govuk-grid-column-one-third">
      <Aside title="Related content">
        <RelatedContent />
      </Aside>
    </div>
  </div>
);

const AboutTheService: FunctionComponent = () => (
  <>
    <p className="govuk-body">
      Use this service to register or update an existing 406MHz distress beacon.
    </p>

    <h2 className="govuk-heading-m">How long it takes</h2>

    <p className="govuk-body">
      TO UPDATE: It takes up to xxx weeks to register your beacon online.
    </p>

    <h2 className="govuk-heading-m">Before you start</h2>

    <p className="govuk-body">
      TO UPDATE: You will need certain information before you start.
    </p>
  </>
);

const OtherWaysToAccessTheService: FunctionComponent = () => (
  <>
    <h2 className="govuk-heading-m">Other ways to apply</h2>

    <p className="govuk-body">
      TO UPDATE: You can request postal forms by emailing.
    </p>
  </>
);

const RelatedContent: FunctionComponent = () => (
  <>
    <ul className="govuk-list govuk-!-font-size-16">
      <li>
        <a className="govuk-link" href="#">
          Related link
        </a>
      </li>
      <li>
        <a className="govuk-link govuk-!-font-size-16" href="#">
          Related link
        </a>
      </li>
    </ul>
  </>
);

export default ServiceStartPage;
