import React, { FunctionComponent } from "react";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { BeaconRegistryContactInfo } from "../components/Mca";
import { GovUKBody } from "../components/Typography";

const FourOhFour: FunctionComponent = (): JSX.Element => {
  return (
    <Layout>
      <Grid
        mainContent={
          <>
            <h1 className="govuk-heading-l">Page not found</h1>
            <GovUKBody>
              If you typed the web address, check it is correct.
            </GovUKBody>
            <GovUKBody>
              If you pasted the web address, check you copied the entire
              address.
            </GovUKBody>
            <GovUKBody>
              If the web address is correct or you selected a link or button,
              use the details below if you need to speak to someone about your
              beacon.
            </GovUKBody>
            <h2 className="govuk-heading-m">Contact the UK Beacon Registry</h2>
            <BeaconRegistryContactInfo />
          </>
        }
      />
    </Layout>
  );
};

export default FourOhFour;
