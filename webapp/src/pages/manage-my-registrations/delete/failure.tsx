import React, { FunctionComponent, type JSX } from "react";
import { ReturnToYourAccountSection } from "../../../components/domain/ReturnToYourAccountSection";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { BeaconRegistryContactInfo } from "../../../components/Mca";
import { PageHeading, SectionHeading } from "../../../components/Typography";

const Success: FunctionComponent = (): JSX.Element => {
  const pageHeading = "There was a problem deleting your registration";

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
              <SectionHeading>
                Please get in touch with the UK Beacon Registry
              </SectionHeading>
              <BeaconRegistryContactInfo />
              <ReturnToYourAccountSection />
            </>
          }
        />
      </Layout>
    </>
  );
};

export default Success;
