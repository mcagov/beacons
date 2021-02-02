import React, { FunctionComponent } from "react";
import Head from "next/head";

const ServiceStartPage: FunctionComponent = () => (
  <>
    <Head>
      <title>Beacon Registration Service - Register a new beacon</title>
    </Head>

    <Heading />

    <AboutTheService />

    <HowLongItTakes />

    <BeforeYouStart />
  </>
);

export default ServiceStartPage;

const Heading: FunctionComponent = () => (
  <h1 className="govuk-heading-l">Register or update a 406 MHz beacon</h1>
);

const AboutTheService: FunctionComponent = () => (
  <p className="govuk-body">
    Use this service to register or update an existing 406MHz distress beacon.
  </p>
);

const HowLongItTakes: FunctionComponent = () => (
  <h2 className="govuk-heading-m">How long it takes</h2>
);

const BeforeYouStart: FunctionComponent = () => (
  <h2 className="govuk-heading-m">Before you start</h2>
);
