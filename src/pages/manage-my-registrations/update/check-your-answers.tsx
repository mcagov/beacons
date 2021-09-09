import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, StartButton } from "../../../components/Button";
import { AdditionalBeaconUseSummary } from "../../../components/domain/AdditionalBeaconUseSummary";
import { CheckYourAnswersBeaconEmergencyContactsSummary } from "../../../components/domain/CheckYourAnswersBeaconEmergencyContactsSummary";
import { CheckYourAnswersBeaconInformationSummary } from "../../../components/domain/CheckYourAnswersBeaconInformationSummary";
import { CheckYourAnswersBeaconOwnerAddressSummary } from "../../../components/domain/CheckYourAnswersBeaconOwnerAddressSummary";
import { CheckYourAnswersBeaconOwnerSummary } from "../../../components/domain/CheckYourAnswersBeaconOwnerSummary";
import { DataRowItem } from "../../../components/domain/DataRowItem";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { SummaryList, SummaryListItem } from "../../../components/SummaryList";
import { PageHeading, SectionHeading } from "../../../components/Typography";
import { DraftRegistration } from "../../../entities/DraftRegistration";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../../lib/types";
import { UpdatePageURLs } from "../../../lib/urls";
import { formatDateLong } from "../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage } from "../../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenUserViewsPage_ThenDisplayPage } from "../../../router/rules/WhenUserViewsPage_ThenDisplayPage";
import { SendYourApplication } from "../../register-a-beacon/check-your-answers";

interface CheckYourAnswersPageProps {
  registration: DraftRegistration;
}

const CheckYourAnswersPage: FunctionComponent<CheckYourAnswersPageProps> = ({
  registration,
}: CheckYourAnswersPageProps): JSX.Element => {
  const pageHeading = `Your registered beacon with Hex ID/UIN: ${registration.hexId}`;
  return (
    <Layout
      navigation={<BackButton href={UpdatePageURLs.emergencyContact} />}
      title={pageHeading}
      showCookieBanner={true}
    >
      <Grid
        mainContent={
          <>
            <PageHeading>{pageHeading}</PageHeading>
            <SectionHeading>About the registration</SectionHeading>
            <SummaryList>
              <SummaryListItem labelText="Registration history">
                <DataRowItem
                  label="First registered"
                  value={formatDateLong(registration.registeredDate)}
                />
                <DataRowItem
                  label="Last updated"
                  value={formatDateLong(registration.lastModifiedDate)}
                />
              </SummaryListItem>
            </SummaryList>
            <SectionHeading>About the beacon</SectionHeading>
            <SummaryList>
              <SummaryListItem
                labelText="Beacon information"
                actions={[
                  {
                    text: "Change",
                    href: UpdatePageURLs.beaconDetails + registration.id,
                  },
                ]}
              >
                <DataRowItem
                  label="Manufacturer"
                  value={registration.manufacturer}
                />
                <DataRowItem label="Model" value={registration.model} />
                <DataRowItem label="Hex ID/UIN" value={registration.hexId} />
              </SummaryListItem>
            </SummaryList>
            <CheckYourAnswersBeaconInformationSummary
              registration={registration}
              changeUrl={"#"}
            />
            <CheckYourAnswersBeaconOwnerSummary
              registration={registration}
              changeUrl={"#"}
            />
            <CheckYourAnswersBeaconOwnerAddressSummary
              registration={registration}
              changeUrl={"#"}
            />
            <CheckYourAnswersBeaconEmergencyContactsSummary
              registration={registration}
              changeUrl={"#"}
            />
            {registration.uses.map((use, index) => (
              <AdditionalBeaconUseSummary
                index={index}
                use={use}
                key={index}
                changeUri={"#"}
              />
            ))}
            <SendYourApplication />
            <StartButton
              buttonText="Accept and send"
              href={UpdatePageURLs.updateComplete}
            />
          </>
        }
      />
    </Layout>
  );
};

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
): Promise<Partial<CheckYourAnswersPageProps>> => {
  const { getDraftRegistration } = context.container;

  const draftRegistration = await getDraftRegistration(
    context.req.cookies[formSubmissionCookieId]
  );
  return {
    registration: draftRegistration,
  };
};

export default CheckYourAnswersPage;
