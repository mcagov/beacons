import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Panel } from "../../components/Panel";
import { GovUKBody } from "../../components/Typography";
import { WarningText } from "../../components/WarningText";
import { GovNotifyGateway } from "../../gateways/govNotifyApiGateway";
import {
  decorateGetServerSidePropsContext,
  withCookieRedirect,
} from "../../lib/middleware";
import { referenceNumber } from "../../lib/utils";
import { SendGovNotifyEmail } from "../../useCases/sendGovNotifyEmail";

interface ApplicationCompleteProps {
  reference: string;
  pageSubHeading: string;
}

const ApplicationCompletePage: FunctionComponent<ApplicationCompleteProps> = ({
  reference,
  pageSubHeading,
}: ApplicationCompleteProps): JSX.Element => {
  const pageHeading = "Application Complete";

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
                {pageSubHeading}
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
  async (context: GetServerSidePropsContext) => {
    const decoratedContext = await decorateGetServerSidePropsContext(context);
    const registration = decoratedContext.registration.registration;

    let pageSubHeading;

    if (!registration.reference) {
      registration.reference = referenceNumber("A#", 7);

      const govNotifyGateway = new GovNotifyGateway();
      const sendGovNotifyEmailUseCase = new SendGovNotifyEmail(
        govNotifyGateway
      );
      sendGovNotifyEmailUseCase.execute(registration);

      pageSubHeading = "We have sent you a confirmation email.";
    } else {
      pageSubHeading = "We could not send you a confirmation email.";
    }

    return {
      props: { reference: registration.reference, pageSubHeading },
    };
  }
);

export default ApplicationCompletePage;
