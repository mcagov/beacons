import React, { FunctionComponent } from "react";
import { LinkButton } from "../components/Button";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { BeaconRegistryContactInfo } from "../components/Mca";
import {
  GovUKBody,
  PageHeading,
  SectionHeading,
} from "../components/Typography";
import { PageURLs } from "../lib/urls";

const Unauthenticated: FunctionComponent = (): JSX.Element => {
  const pageHeading = "You must be signed in to access this page";

  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>
            <GovUKBody>
              To access this service, you must return to the service start page
              and start again.
            </GovUKBody>
            <GovUKBody>
              Make sure that your browser can accept cookies.
            </GovUKBody>
            <LinkButton
              buttonText="Go to service start page"
              href={PageURLs.start}
            />
            <SectionHeading>Contact the UK Beacon Registry</SectionHeading>
            <BeaconRegistryContactInfo />
          </>
        }
      />
    </Layout>
  );
};

export default Unauthenticated;
