import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Panel } from "../../components/Panel";
import { WarningText } from "../../components/WarningText";

const ApplicationCompletePage: FunctionComponent = () => (
  <>
    <Layout>
      <Grid
        mainContent={
          <>
            <Panel title="Application Complete">
              We have sent you a confirmation email.
            </Panel>
            <ApplicationCompleteWhatNext />
            <WarningText>
              <p className="govuk-body govuk-!-font-weight-bold">
                You can still use your beacon. Search and Rescue will be able to
                identify and locate you.
              </p>
              <p className="govuk-body govuk-!-font-weight-bold">
                Remember your beacon should only be used in an emergency. If
                needed, you can also contact HM Coastguard 24/7 on Tel: 020 381
                72630.
              </p>
            </WarningText>
          </>
        }
      />
    </Layout>
  </>
);

const ApplicationCompleteWhatNext: FunctionComponent = () => (
  <>
    <h2 className="govuk-heading-m">What happens next</h2>
    <div className="govuk-body">
      We&apos;ve sent your application to register a UK encoded 406MHz beacon to
      The Maritime and Coastguard Beacon Registry office.
    </div>
    <div className="govuk-body">
      They will contact you either to confirm your registration, or to ask for
      more information.
    </div>
  </>
);

export default ApplicationCompletePage;
