import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Panel } from "../../components/Panel";
import { GovUKBody } from "../../components/Typography";
import { WarningText } from "../../components/WarningText";
import { withCookieRedirect } from "../../lib/middleware";

interface ApplicationCompletePageProps {
  showCookieBanner: boolean;
}

const ApplicationCompletePage: FunctionComponent<ApplicationCompletePageProps> = ({
  showCookieBanner,
}: ApplicationCompletePageProps): JSX.Element => {
  const pageHeading = "Application Complete";

  return (
    <>
      <Layout
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <Panel title={pageHeading}>
                We have sent you a confirmation email.
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
            </>
          }
        />
      </Layout>
    </>
  );
};

const ApplicationCompleteWhatNext: FunctionComponent = (): JSX.Element => (
  <>
    <h2 className="govuk-heading-m">What happens next</h2>
    <GovUKBody>
      We&apos;ve sent your application to register a UK encoded 406MHz beacon to
      The Maritime and Coastguard Beacon Registry office.
    </GovUKBody>
    <GovUKBody>
      They will contact you either to confirm your registration, or to ask for
      more information.
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async () => {
    return {
      props: {},
    };
  }
);

export default ApplicationCompletePage;
