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
import { AccountPageURLs } from "../../../../lib/urls";
import { Actions } from "../../../../lib/URLs/Actions";
import { Pages } from "../../../../lib/URLs/Pages";
import { UrlBuilder } from "../../../../lib/URLs/UrlBuilder";
import { formatDateLong } from "../../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../../router/BeaconsPageRouter";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend } from "../../../../router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasNotMadeChanges_ThenShowTheExistingRegistration } from "../../../../router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasNotMadeChanges_ThenShowTheExistingRegistration";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
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
                      href: UrlBuilder.buildRegistrationUrl(
                        Actions.update,
                        Pages.beaconDetails,
                        registration.id
                      ),
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
                changeUrl={UrlBuilder.buildRegistrationUrl(
                  Actions.update,
                  Pages.beaconInformation,
                  registration.id
                )}
              />
              {registration.uses.map((use, index) => (
                <AdditionalBeaconUseSummary
                  index={index}
                  use={use}
                  key={index}
                  changeUri={UrlBuilder.buildUseSummaryUrl(
                    Actions.update,
                    registration.id
                  )}
                />
              ))}
              <CheckYourAnswersBeaconOwnerSummary
                registration={registration}
                changeUrl={UrlBuilder.buildRegistrationUrl(
                  Actions.update,
                  Pages.aboutBeaconOwner,
                  registration.id
                )}
              />
              <CheckYourAnswersBeaconOwnerAddressSummary
                registration={registration}
                changeUrl={UrlBuilder.buildRegistrationUrl(
                  Actions.update,
                  Pages.beaconOwnerAddress,
                  registration.id
                )}
              />
              <CheckYourAnswersBeaconEmergencyContactsSummary
                registration={registration}
                changeUrl={UrlBuilder.buildRegistrationUrl(
                  Actions.update,
                  Pages.emergencyContact,
                  registration.id
                )}
              />
              {userHasEdited && (
                <>
                  <SendYourApplication />
                  <StartButton
                    buttonText="Accept and send"
                    href={UrlBuilder.buildRegistrationUrl(
                      Actions.update,
                      Pages.complete,
                      registration.id
                    )}
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
    const registrationId = context.query.registrationId as string;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
        context,
        registrationId
      ),
      new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasNotMadeChanges_ThenShowTheExistingRegistration(
        context,
        registrationId
      ),
    ]).execute();
  })
);

export default RegistrationSummaryPage;
