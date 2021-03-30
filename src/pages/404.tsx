import React, { FunctionComponent } from "react";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { BeaconRegistryContactInfo } from "../components/Mca";
import { GovUKBody, PageHeading } from "../components/Typography";

const Custom404: FunctionComponent = (): JSX.Element => {
  const pageHeading = "Page not found";

  return (
    <Layout title={pageHeading} pageHasErrors={false} showCookieBanner={false}>
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>
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

export default Custom404;
