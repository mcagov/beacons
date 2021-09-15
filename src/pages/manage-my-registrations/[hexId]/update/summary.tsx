import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, StartButton } from "../../../../components/Button";
import { AdditionalBeaconUseSummary } from "../../../../components/domain/AdditionalBeaconUseSummary";
import { CheckYourAnswersBeaconEmergencyContactsSummary } from "../../../../components/domain/CheckYourAnswersBeaconEmergencyContactsSummary";
import { CheckYourAnswersBeaconInformationSummary } from "../../../../components/domain/CheckYourAnswersBeaconInformationSummary";
import { CheckYourAnswersBeaconOwnerAddressSummary } from "../../../../components/domain/CheckYourAnswersBeaconOwnerAddressSummary";
import { CheckYourAnswersBeaconOwnerSummary } from "../../../../components/domain/CheckYourAnswersBeaconOwnerSummary";
import { DataRowItem } from "../../../../components/domain/DataRowItem";
import { Grid } from "../../../../components/Grid";
import { Layout } from "../../../../components/Layout";
import { BeaconRegistryContactInfo } from "../../../../components/Mca";
import {
  SummaryList,
  SummaryListItem,
} from "../../../../components/SummaryList";
import {
  GovUKBody,
  PageHeading,
  SectionHeading,
} from "../../../../components/Typography";
import { Registration } from "../../../../entities/Registration";
import { BeaconsGetServerSidePropsContext } from "../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../lib/middleware/withContainer";
import { withSession } from "../../../../lib/middleware/withSession";
import {
  AccountPageURLs,
  queryParams,
  UpdatePageURLs,
} from "../../../../lib/urls";
import { formatDateLong } from "../../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../../router/BeaconsPageRouter";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend } from "../../../../router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenUserViewsPage_ThenDisplayPage } from "../../../../router/rules/WhenUserViewsPage_ThenDisplayPage";
import { SendYourApplication } from "../../../register-a-beacon/check-your-answers";

interface RegistrationSummaryPageProps {
  registration: Registration;
  userHasEdited: boolean;
}

const RegistrationSummaryPage: FunctionComponent<RegistrationSummaryPageProps> =
  ({
    registration,
    userHasEdited,
  }: RegistrationSummaryPageProps): JSX.Element => {
    const pageHeading = `Your registered beacon with Hex ID/UIN: ${registration.hexId}`;

    return (
      <Layout
        navigation={<BackButton href={AccountPageURLs.accountHome} />}
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
                changeUrl={UpdatePageURLs.beaconInformation + registration.id}
              />
              {registration.uses.map((use, index) => (
                <AdditionalBeaconUseSummary
                  index={index}
                  use={use}
                  key={index}
                  changeUri={
                    UpdatePageURLs.usesSummary +
                    queryParams({
                      registrationId: registration.id,
                      useIndex: index,
                    })
                  }
                />
              ))}
              <CheckYourAnswersBeaconOwnerSummary
                registration={registration}
                changeUrl={UpdatePageURLs.aboutBeaconOwner}
              />
              <CheckYourAnswersBeaconOwnerAddressSummary
                registration={registration}
                changeUrl={UpdatePageURLs.beaconOwnerAddress}
              />
              <CheckYourAnswersBeaconEmergencyContactsSummary
                registration={registration}
                changeUrl={UpdatePageURLs.emergencyContact}
              />
              {userHasEdited && (
                <>
                  <SendYourApplication />
                  <StartButton
                    buttonText="Accept and send"
                    href={UpdatePageURLs.updateComplete}
                  />
                </>
              )}

              <SectionHeading>Contact the Beacon Registry Team</SectionHeading>
              <GovUKBody>
                If you have a question about your beacon registration, contact
                the UK Beacon Registry team on:
              </GovUKBody>
              <BeaconRegistryContactInfo />
            </>
          }
        />
      </Layout>
    );
  };

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const registrationId = context.query.id as string;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenAllowThemToAcceptAndSend(
        context,
        registrationId,
        props(context)
      ),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
    ]).execute();
  })
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<RegistrationSummaryPageProps>> => {
  const { getAccountHolderId, getAccountHoldersRegistration } =
    context.container;

  const registrationId = context.query.id as string;

  return {
    registration: await getAccountHoldersRegistration(
      registrationId,
      await getAccountHolderId(context.session)
    ),
  };
};

export default RegistrationSummaryPage;
