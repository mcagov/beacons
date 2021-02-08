import React, { FunctionComponent } from "react";
import { Grid } from "../components/Grid";
import { Layout } from "../components/Layout";
import { Panel } from "../components/Panel";
import { SummaryList, SummaryListItem } from "../components/SummaryList";
import { WarningText } from "../components/WarningText";

const ApplicationCompletePage: FunctionComponent = () => (
  <>
    <Layout>
      <Grid
        mainContent={
          <>
            <Panel title="Application Complete"></Panel>
            <div className="govuk-body">
              We have sent you a confirmation email.
            </div>
            <ApplicationCompleteWhatNext />
            <WarningText text="You can still use your beacon. Search &amp; Rescue will still be able to locate you even though your beacon is not registered yet." />
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
