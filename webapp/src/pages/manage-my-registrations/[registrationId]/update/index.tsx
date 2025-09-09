import { GetServerSideProps } from "next";
import React, { FunctionComponent, type JSX } from "react";
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
  AnchorLink,
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
  DeleteRegistrationPageURLs,
  queryParams,
} from "../../../../lib/urls";
import { Actions } from "../../../../lib/URLs/Actions";
import { Pages } from "../../../../lib/URLs/Pages";
import { UrlBuilder } from "../../../../lib/URLs/UrlBuilder";
import { formatDateLong } from "../../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../../router/BeaconsPageRouter";
import { GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage } from "../../../../router/rules/GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend } from "../../../../router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasNotMadeChanges_ThenShowTheExistingRegistration } from "../../../../router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasNotMadeChanges_ThenShowTheExistingRegistration";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { SendYourApplication } from "../../../register-a-beacon/check-your-answers";
import { GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeInvalidChangesToTheDraft_ThenRemoveInvalidChanges } from "../../../../router/rules/GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeInvalidChangesToTheDraft_ThenRemoveInvalidChanges";
import { GivenUserHasCompletedADraftRegistrationOrUpdatedAnExistingRegistration_ThenDeleteItAndReloadPage } from "../../../../router/rules/GivenUserHasCompletedADraftRegistrationOrUpdatedAnExistingRegistration_ThenDeleteItAndReloadPage";

interface RegistrationSummaryPageProps {
  registration: Registration;
  userHasEdited: boolean;
}

const RegistrationSummaryPage: FunctionComponent<
  RegistrationSummaryPageProps
> = ({
  registration,
  userHasEdited,
}: RegistrationSummaryPageProps): JSX.Element => {
  const pageHeading = `Your registered beacon with Hex ID/UIN: ${registration.hexId}`;

  const confirmBeforeDelete = (registrationId: string) =>
    DeleteRegistrationPageURLs.deleteRegistration +
    queryParams({
      id: registrationId,
    });

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

            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                <SectionHeading>About the beacon</SectionHeading>
              </dt>
              <dd className="govuk-summary-list__actions">
                <a
                  className="govuk-link"
                  style={{ color: "#d4351c", fontSize: "1.1875rem" }}
                  href={confirmBeforeDelete(registration.id)}
                >
                  Delete this registration
                  <span className="govuk-visually-hidden">
                    Delete this registration
                  </span>
                </a>
              </dd>
            </div>
            <SummaryList>
              <SummaryListItem
                labelText="Beacon information"
                actions={[
                  {
                    text: "Change",
                    href: UrlBuilder.buildRegistrationUrl(
                      Actions.update,
                      Pages.beaconDetails,
                      registration.id,
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
                registration.id,
              )}
            />
            <UpdateUseSection registrationId={registration.id} />
            {registration.uses.map((use, index) => (
              <AdditionalBeaconUseSummary index={index} use={use} key={index} />
            ))}
            <CheckYourAnswersBeaconOwnerSummary
              registration={registration}
              changeUrl={UrlBuilder.buildRegistrationUrl(
                Actions.update,
                Pages.aboutBeaconOwner,
                registration.id,
              )}
            />
            <CheckYourAnswersBeaconOwnerAddressSummary
              registration={registration}
              changeUrl={UrlBuilder.buildRegistrationUrl(
                Actions.update,
                Pages.beaconOwnerAddress,
                registration.id,
              )}
            />
            <CheckYourAnswersBeaconEmergencyContactsSummary
              registration={registration}
              changeUrl={UrlBuilder.buildRegistrationUrl(
                Actions.update,
                Pages.emergencyContact,
                registration.id,
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
                    registration.id,
                  )}
                />
              </>
            )}

            <SectionHeading>Contact the Beacon Registry Team</SectionHeading>
            <GovUKBody>
              If you have a question about your beacon registration, contact the
              UK Beacon Registry team on:
            </GovUKBody>
            <BeaconRegistryContactInfo />
          </>
        }
      />
    </Layout>
  );
};

const UpdateUseSection = ({
  registrationId,
}: {
  registrationId: string;
}): JSX.Element => (
  <div
    className="govuk-!-margin-bottom-4 govuk-summary-list"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    }}
  >
    <SectionHeading classes="govuk-!-margin-0">
      How this beacon is used
    </SectionHeading>
    <div>
      <AnchorLink
        href={UrlBuilder.buildUseSummaryUrl(Actions.update, registrationId)}
        classes="govuk-link--no-visited-state"
      >
        Change
      </AnchorLink>
    </div>
  </div>
);

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const registrationId = context.query.registrationId as string;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
        context,
      ),
      new GivenUserHasCompletedADraftRegistrationOrUpdatedAnExistingRegistration_ThenDeleteItAndReloadPage(
        context,
      ),
      new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeInvalidChangesToTheDraft_ThenRemoveInvalidChanges(
        context,
        registrationId,
      ),
      new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasMadeChangesToTheDraft_ThenShowChangesAndAllowThemToAcceptAndSend(
        context,
        registrationId,
      ),
      new GivenUserIsUpdatingAnExistingRegistration_WhenUserHasNotMadeChanges_ThenShowTheExistingRegistration(
        context,
        registrationId,
      ),
    ]).execute();
  }),
);

export default RegistrationSummaryPage;
