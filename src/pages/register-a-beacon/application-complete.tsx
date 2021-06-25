import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { LinkButton } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { Panel } from "../../components/Panel";
import { GovUKBody, SectionHeading } from "../../components/Typography";
import { WarningText } from "../../components/WarningText";
import {
  BeaconsGetServerSidePropsContext,
  withContainer,
} from "../../lib/container";
import { clearFormSubmissionCookie } from "../../lib/middleware";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { retrieveUserFormSubmissionId } from "../../lib/retrieveUserFormSubmissionId";
import { PageURLs } from "../../lib/urls";
import { verifyFormSubmissionCookieIsSet } from "../../lib/verifyFormSubmissionCookieIsSet";
import { getAccountHolderId } from "../../useCases/getAccountHolderId";
import {
  ISubmitRegistrationResult,
  submitRegistration,
} from "../../useCases/submitRegistration";

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
      We&apos;ve sent your application to register a UK encoded 406 MHz beacon
      to The Maritime and Coastguard Beacon Registry office.
    </GovUKBody>
    <GovUKBody>
      They will contact you either to confirm your registration, or to ask for
      more information.
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

export const getServerSideProps: GetServerSideProps = withContainer(
  async (context: BeaconsGetServerSidePropsContext) => {
    /* Page logic */
    if (!verifyFormSubmissionCookieIsSet(context))
      return redirectUserTo(PageURLs.start);

    try {
      const accountHolderId = await getAccountHolderId(context.container)(
        context
      );
      const registration = retrieveUserFormSubmissionId(context);
      const result = await submitRegistration(context.container)(
        registration,
        accountHolderId
      );

      const pageSubHeading = (result: ISubmitRegistrationResult) => {
        if (result.beaconRegistered && result.confirmationEmailSent)
          return "We have sent you a confirmation email.";
        if (result.beaconRegistered && !result.confirmationEmailSent)
          return "We could not send you a confirmation email. But we have registered your beacon under the following reference id.";
        return "We could not save your registration or send you a confirmation email. Please contact the Beacons Registry team.";
      };

      clearFormSubmissionCookie(context);

      return {
        props: {
          reference: result.referenceNumber,
          pageSubHeading: pageSubHeading(result),
        },
      };
    } catch {
      return {
        props: {
          reference: "",
          pageSubHeading:
            "There was an error while registering your beacon.  Please contact the Beacons Registry team.",
        },
      };
    }
  }
);

export default ApplicationCompletePage;
