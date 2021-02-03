import React, { FunctionComponent } from "react";
import Head from "next/head";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";

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
          <InsetText>
            The details of your beacon must be checked to ensure they have a UK
            encoding and if they are already registered with this service.
          </InsetText>
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
