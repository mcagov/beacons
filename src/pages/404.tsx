import React from "react";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { BeaconRegistryContactInfo } from "../components/Mca";

const FourOhFour = (): JSX.Element => {
  return (
    <Layout>
      <Grid
        mainContent={
          <>
            <h1 className="govuk-heading-l">Page not found</h1>
            <p className="govuk-body">
              If you typed the web address, check it is correct.
            </p>
            <p className="govuk-body">
              If you pasted the web address, check you copied the entire
              address.
            </p>
            <p className="govuk-body">
              If the web address is correct or you selected a link or button,
              use the details below if you need to speak to someone about your
              beacon.
            </p>
            <h2 className="govuk-heading-m">Contact the UK Beacon Registry</h2>
            <BeaconRegistryContactInfo />
          </>
        }
      />
    </Layout>
  );
};

export default FourOhFour;
