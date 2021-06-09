import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Panel } from "../../components/Panel";
import { GovUKBody, SectionHeading } from "../../components/Typography";
import { WarningText } from "../../components/WarningText";
import {
  BeaconsGetServerSidePropsContext,
  withCookieRedirectContainer,
} from "../../lib/container";
import {
  clearFormCache,
  clearFormSubmissionCookie,
  decorateGetServerSidePropsContext,
} from "../../lib/middleware";
import { formSubmissionCookieId } from "../../lib/types";
import { referenceNumber } from "../../lib/utils";
import { ICreateRegistration } from "../../useCases/createRegistration";
import { ISendGovNotifyEmail } from "../../useCases/sendGovNotifyEmail";

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
    <SectionHeading>What happens next</SectionHeading>
    <GovUKBody>
      We&apos;ve sent your application to register a UK encoded 406 MHz beacon
      to The Maritime and Coastguard Beacon Registry office.
    </GovUKBody>
    <GovUKBody>
      They will contact you either to confirm your registration, or to ask for
      more information.
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirectContainer(
  async (context: BeaconsGetServerSidePropsContext) => {
    const decoratedContext = await decorateGetServerSidePropsContext(context);
    const registrationClass = decoratedContext.registration;
    const registration = decoratedContext.registration.getRegistration();

    let pageSubHeading;

    if (!registration.referenceNumber) {
      try {
        registration.referenceNumber = referenceNumber("A#", 7);
        const createRegistrationUseCase: ICreateRegistration = context.container.getCreateRegistration();

        const success: boolean = await createRegistrationUseCase.execute(
          registrationClass
        );

        if (success) {
          const sendGovNotifyEmailUseCase: ISendGovNotifyEmail = context.container.getSendGovNotifyEmail();

          const emailSuccess: boolean = await sendGovNotifyEmailUseCase.execute(
            registration
          );

          if (emailSuccess) {
            pageSubHeading = "We have sent you a confirmation email.";
          } else {
            pageSubHeading =
              "We could not send you a confirmation email. But we have registered your beacon under the following reference id.";
          }
        } else {
          registration.referenceNumber = "";
        }
      } catch (e) {
        registration.referenceNumber = "";
        pageSubHeading =
          "We could not save your registration or send you a confirmation email. Please contact the Beacons Registry team.";
      }
    }

    clearFormCache(context.req.cookies[formSubmissionCookieId]);
    clearFormSubmissionCookie(context);

    return {
      props: { reference: registration.referenceNumber, pageSubHeading },
    };
  }
);

export default ApplicationCompletePage;
