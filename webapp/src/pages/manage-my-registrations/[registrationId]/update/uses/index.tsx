import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../../../../../components/Button";
import { AdditionalBeaconUseSummary } from "../../../../../components/domain/AdditionalBeaconUseSummary";
import { Grid } from "../../../../../components/Grid";
import { Layout } from "../../../../../components/Layout";
import { GovUKBody, PageHeading } from "../../../../../components/Typography";
import { DraftBeaconUse } from "../../../../../entities/DraftBeaconUse";
import { DraftRegistration } from "../../../../../entities/DraftRegistration";
import { BeaconsGetServerSidePropsContext } from "../../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../../lib/middleware/withContainer";
import { withSession } from "../../../../../lib/middleware/withSession";
import {
  ActionURLs,
  ErrorPageURLs,
  GeneralPageURLs,
  queryParams,
} from "../../../../../lib/urls";
import { Actions } from "../../../../../lib/URLs/Actions";
import { Pages } from "../../../../../lib/URLs/Pages";
import { UrlBuilder } from "../../../../../lib/URLs/UrlBuilder";
import { UsePages } from "../../../../../lib/URLs/UsePages";
import { prettyUseName } from "../../../../../lib/writingStyle";
import { BeaconsPageRouter } from "../../../../../router/BeaconsPageRouter";
import { GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache } from "../../../../../router/rules/GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache";
import { GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage } from "../../../../../router/rules/GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage";
import { GivenUserIsEditingADraftRegistration_ThenMakeTheDraftRegistrationAvailable } from "../../../../../router/rules/GivenUserIsEditingADraftRegistration_ThenMakeTheDraftRegistrationAvailable";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface UseSummaryProps {
  draftRegistration: DraftRegistration;
  uses: DraftBeaconUse[];
  showCookieBanner?: boolean;
}

const AdditionalBeaconUse: FunctionComponent<UseSummaryProps> = ({
  draftRegistration,
  showCookieBanner,
}: UseSummaryProps): JSX.Element => {
  const pageHeading = "Summary of how you use this beacon";

  return (
    <>
      <Layout
        navigation={
          draftRegistration.uses.length > 0 && (
            <BackButton
              href={UrlBuilder.buildRegistrationUrl(
                Actions.update,
                Pages.summary,
                draftRegistration.id
              )}
            />
          )
        }
        title={pageHeading}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <PageHeading>{pageHeading}</PageHeading>

              {draftRegistration.uses.length === 0 && (
                <>
                  <GovUKBody>
                    You have not assigned any uses to this beacon yet.
                  </GovUKBody>

                  <LinkButton
                    buttonText="Add a use for this beacon"
                    href={
                      ActionURLs.addNewUseToDraftRegistration +
                      queryParams({
                        nextPage: UrlBuilder.buildUseUrl(
                          Actions.update,
                          UsePages.environment,
                          draftRegistration.id,
                          draftRegistration.uses.length.toString()
                        ),
                      })
                    }
                  />
                </>
              )}

              {draftRegistration.uses.length > 0 && (
                <>
                  {draftRegistration.uses.map((use, index) => {
                    return (
                      <AdditionalBeaconUseSummary
                        index={index}
                        use={use}
                        changeUri={"xxx"}
                        deleteUri={confirmBeforeDelete(
                          use,
                          index,
                          draftRegistration.id
                        )}
                        key={`row${index}`}
                      />
                    );
                  })}
                  <LinkButton
                    buttonText="Add another use for this beacon"
                    href={
                      ActionURLs.addNewUseToDraftRegistration +
                      queryParams({
                        nextPage: UrlBuilder.buildUseUrl(
                          Actions.update,
                          UsePages.environment,
                          draftRegistration.id,
                          draftRegistration.uses.length.toString()
                        ),
                      })
                    }
                    classes="govuk-button--secondary"
                  />
                  <br />
                  <br />
                  <LinkButton
                    buttonText="Continue"
                    href={UrlBuilder.buildUpdateRegistrationSummaryUrl(
                      draftRegistration.id
                    )}
                  />
                </>
              )}
            </>
          }
        />
      </Layout>
    </>
  );
};

const confirmBeforeDelete = (
  use: DraftBeaconUse,
  index: number,
  registrationId: string
) =>
  GeneralPageURLs.areYouSure +
  queryParams({
    action: "delete your " + prettyUseName(use) + " use",
    yes:
      ActionURLs.deleteCachedUse +
      queryParams({
        useId: index,
        onSuccess: UrlBuilder.buildUseSummaryUrl(
          Actions.update,
          registrationId
        ),
        onFailure: ErrorPageURLs.serverError,
      }),
    no: UrlBuilder.buildUseSummaryUrl(Actions.update, registrationId),
  });

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const registrationId = context.query.registrationId as string;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
        context
      ),
      new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
        context,
        registrationId
      ),
      new GivenUserIsEditingADraftRegistration_ThenMakeTheDraftRegistrationAvailable(
        context
      ),
    ]).execute();
  })
);

export default AdditionalBeaconUse;
