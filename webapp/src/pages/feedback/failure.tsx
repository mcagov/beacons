import React, { FunctionComponent } from "react";
import { LinkButton } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { BeaconRegistryContactInfo } from "../../components/Mca";
import {
  GovUKBody,
  PageHeading,
  SectionHeading,
} from "../../components/Typography";
import { GeneralPageURLs } from "../../lib/urls";

const Failure: FunctionComponent = (): JSX.Element => {
  const pageHeading = "Sorry, there was a problem submitting your feedback";

  return (
    <>
      <Layout
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <GovUKBody>
                Please contact the UK Beacon Registry to submit your feedback
                directly.
              </GovUKBody>
              <LinkButton
                buttonText="Go to service start page"
                href={GeneralPageURLs.start}
              />
              <SectionHeading>Contact the UK Beacon Registry</SectionHeading>
              <BeaconRegistryContactInfo />
            </>
          }
        />
      </Layout>
    </>
  );
};

export default Failure;
