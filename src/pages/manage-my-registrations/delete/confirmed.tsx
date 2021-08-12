import React, { FunctionComponent } from "react";
import { LinkButton } from "../../../components/Button";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { Panel } from "../../../components/Panel";
import { GovUKBody, SectionHeading } from "../../../components/Typography";
import { WarningText } from "../../../components/WarningText";
import { PageURLs } from "../../../lib/urls";

interface ApplicationCompleteProps {
  reference: string;
  success: boolean;
}

const ApplicationCompletePage: FunctionComponent<ApplicationCompleteProps> = ({
  reference,
  success,
}: ApplicationCompleteProps): JSX.Element => {
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
              <Panel title={pageHeading} reference={reference}>
                Your reference number is <br />
                TODO
              </Panel>
              <ApplicationCompleteWhatNext />
              <WarningText>
                <GovUKBody className="govuk-!-font-weight-bold">
                  You can still use your beacon. Search and Rescue will be able
                  to identify and locate you.
                </GovUKBody>
                <GovUKBody className="govuk-!-font-weight-bold">
                  Remember your beacon should only be used in an emergency. If
                  needed, you can also contact HM Coastguard 24/7 on Tel: 020
                  381 72630.
                </GovUKBody>
              </WarningText>
              <ApplicationCompleteYourBeaconRegistryAccount />
            </>
          }
        />
      </Layout>
    </>
  );
};

const ApplicationCompleteWhatNext: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>What happens next</SectionHeading>
    <GovUKBody>
      If the beacon has changed hands you should tell the new owner to register
      it using this service.
    </GovUKBody>
  </>
);

const ApplicationCompleteYourBeaconRegistryAccount: FunctionComponent =
  (): JSX.Element => (
    <>
      <SectionHeading>Your Beacon Registry Account</SectionHeading>
      <LinkButton
        buttonText="Return to your Account"
        href={PageURLs.accountHome}
      />
    </>
  );

export default ApplicationCompletePage;
