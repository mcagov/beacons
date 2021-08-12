import React, { FunctionComponent } from "react";
import { ReturnToYourAccountSection } from "../../../components/domain/ReturnToYourAccountSection";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { Panel } from "../../../components/Panel";
import { GovUKBody, SectionHeading } from "../../../components/Typography";

const Success: FunctionComponent = (): JSX.Element => {
  const pageHeading = "Registration deleted";

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
              <Panel
                title={pageHeading}
                styles={{
                  color: "#f3f2f1",
                  background: "#0b0c0c",
                }}
              >
                Your beacon is no longer registered with the Maritime &
                Coastguard Agency
              </Panel>
              <SectionHeading>What happens next</SectionHeading>
              <GovUKBody>
                If the beacon has changed hands you should tell the new owner to
                register it using this service.
              </GovUKBody>
              <ReturnToYourAccountSection />
            </>
          }
        />
      </Layout>
    </>
  );
};

export default Success;
