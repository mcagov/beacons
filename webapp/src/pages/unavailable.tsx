import React, { FunctionComponent } from "react";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { BeaconRegistryContactInfo } from "../components/Mca";
import {
  GovUKBody,
  PageHeading,
  SectionHeading,
} from "../components/Typography";

const Unavailable: FunctionComponent = () => {
  const pageHeading = "Sorry, the service is unavailable";

  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>

            <GovUKBody>You will be able to use the service soon.</GovUKBody>

            <BeaconRegistryContactInfo />
            <GovUKBody>
              In an emergency in the UK, dial 999 and ask for the Coastguard. If
              you are at sea and have GMDSS systems, use them to make a distress
              or urgency alert.
            </GovUKBody>
          </>
        }
      />
    </Layout>
  );
};

export default Unavailable;
