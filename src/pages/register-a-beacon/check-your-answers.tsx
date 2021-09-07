import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, StartButton } from "../../components/Button";
import { CheckYourAnswersBeaconDetailsSummary } from "../../components/domain/CheckYourAnswersBeaconDetailsSummary";
import { CheckYourAnswersBeaconEmergencyContactsSummary } from "../../components/domain/CheckYourAnswersBeaconEmergencyContactsSummary";
import { CheckYourAnswersBeaconInformationSummary } from "../../components/domain/CheckYourAnswersBeaconInformationSummary";
import { CheckYourAnswersBeaconOwnerAddressSummary } from "../../components/domain/CheckYourAnswersBeaconOwnerAddressSummary";
import { CheckYourAnswersBeaconOwnerSummary } from "../../components/domain/CheckYourAnswersBeaconOwnerSummary";
import { CheckYourAnswersBeaconUseSummary } from "../../components/domain/CheckYourAnswersBeaconUseSummary";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import {
  GovUKBody,
  PageHeading,
  SectionHeading,
} from "../../components/Typography";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import { CreateRegistrationPageURLs } from "../../lib/urls";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenUserViewsPage_ThenDisplayPage } from "../../router/rules/WhenUserViewsPage_ThenDisplayPage";

interface CheckYourAnswersProps {
  registration: DraftRegistration;
}

const CheckYourAnswersPage: FunctionComponent<CheckYourAnswersProps> = ({
  registration,
}: CheckYourAnswersProps): JSX.Element => {
  const pageHeading = "Check your answers";
  const useSections = [];
  for (const [index, use] of registration.uses.entries()) {
    useSections.push(
      <CheckYourAnswersBeaconUseSummary
        index={index}
        use={use}
        key={`row${index}`}
      />
    );
  }

  return (
    <>
      <Layout
        navigation={
          <BackButton href={CreateRegistrationPageURLs.emergencyContact} />
        }
        title={pageHeading}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>
              <GovUKBody>
                Please check you answer before sending in your registration
                application
              </GovUKBody>
              <CheckYourAnswersBeaconDetailsSummary
                {...registration}
                changeUrl={CreateRegistrationPageURLs.checkBeaconDetails}
              />
              <CheckYourAnswersBeaconInformationSummary
                registration={registration}
                changeUrl={CreateRegistrationPageURLs.beaconInformation}
              />
              {useSections}
              <CheckYourAnswersBeaconOwnerSummary
                registration={registration}
                changeUrl={CreateRegistrationPageURLs.aboutBeaconOwner}
              />
              <CheckYourAnswersBeaconOwnerAddressSummary
                registration={registration}
                changeUrl={CreateRegistrationPageURLs.beaconOwnerAddress}
              />
              <CheckYourAnswersBeaconEmergencyContactsSummary
                registration={registration}
                changeUrl={CreateRegistrationPageURLs.emergencyContact}
              />
              <SendYourApplication />
              <StartButton
                buttonText="Accept and send"
                href={CreateRegistrationPageURLs.applicationComplete}
              />
            </>
          }
        />
      </Layout>
    </>
  );
};

const SendYourApplication: FunctionComponent = (): JSX.Element => (
  <>
    <SectionHeading>Now send in your application</SectionHeading>

    <GovUKBody>
      By submitting this registration you are confirming that, to the best of
      your knowledge, the details you are providing are correct.
    </GovUKBody>
  </>
);

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage(
        context
      ),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
    ]).execute();
  })
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<CheckYourAnswersProps>> => {
  const draftRegistration = await context.container.getDraftRegistration(
    context.req.cookies[formSubmissionCookieId]
  );

  return {
    registration: draftRegistration,
  };
};

export default CheckYourAnswersPage;
