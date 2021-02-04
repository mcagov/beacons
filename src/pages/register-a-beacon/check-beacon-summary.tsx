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
          <p>Form data going to appear here</p>
        </>
      }
    />
  </>
);

export default CheckBeaconDetails;
