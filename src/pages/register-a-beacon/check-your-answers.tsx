import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, StartButton } from "../../components/Button";
import {
  BeaconDetailsSection,
  BeaconEmergencyContactsSection,
  BeaconInformationSection,
  BeaconOwnerAddressSection,
  BeaconOwnerSection,
} from "../../components/domain/Summary";
import { SummaryBeaconUseSection } from "../../components/domain/SummaryBeaconUseSection";
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
import { PageURLs } from "../../lib/urls";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserViewedPage } from "../../router/rules/IfUserViewedPage";

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
      <SummaryBeaconUseSection index={index} use={use} key={`row${index}`} />
    );
  }

  return (
    <>
      <Layout
        navigation={<BackButton href={PageURLs.emergencyContact} />}
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
              <BeaconDetailsSection
                {...registration}
                changeUrl={PageURLs.checkBeaconDetails}
              />
              <BeaconInformationSection
                {...registration}
                changeUrl={PageURLs.beaconInformation}
              />
              {useSections}
              <BeaconOwnerSection
                {...registration}
                changeUrl={PageURLs.aboutBeaconOwner}
              />
              <BeaconOwnerAddressSection
                {...registration}
                changeUrl={PageURLs.beaconOwnerAddress}
              />
              <BeaconEmergencyContactsSection
                {...registration}
                changeUrl={PageURLs.emergencyContact}
              />
              <SendYourApplication />
              <StartButton
                buttonText="Accept and send"
                href={PageURLs.applicationComplete}
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
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new IfUserViewedPage(context, props(context)),
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
