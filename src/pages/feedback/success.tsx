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

const Success: FunctionComponent = (): JSX.Element => {
  const pageHeading = "Feedback submitted";

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
              <GovUKBody>Thank you for submitting your feedback.</GovUKBody>
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

export default Success;
