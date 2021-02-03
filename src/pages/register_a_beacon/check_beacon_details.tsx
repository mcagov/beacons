import React, { FunctionComponent } from "react";
import Head from "next/head";
import { Grid } from "../../components/Grid";

const CheckBeaconDetails: FunctionComponent = () => (
  <>
    <Head>
      <title>
        Beacon Registration Service - Register a new 406 MHz distress beacon
      </title>
    </Head>

    <Grid
      mainContent={
        <>
          <PageHeading />
        </>
      }
      aside={null}
    />
  </>
);

const PageHeading: FunctionComponent = () => (
  <h1 className="govuk-heading-l">Check beacon details</h1>
);

export default CheckBeaconDetails;
