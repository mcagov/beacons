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
import { formSubmissionCookieId } from "../../../../../lib/types";
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
import { GivenUserIsEditingADraftRegistration_ThenMakeTheDraftRegistrationAvailable } from "../../../../../router/rules/GivenUserIsEditingADraftRegistration_ThenMakeTheDraftRegistrationAvailable";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface UseSummaryProps {
  draftRegistration: DraftRegistration;
  uses: DraftBeaconUse[];
  showCookieBanner?: boolean;
}

const AdditionalBeaconUse: FunctionComponent<UseSummaryProps> = ({
  draftRegistration,
  uses,
  showCookieBanner,
}: UseSummaryProps): JSX.Element => {
  const pageHeading = "Summary of how you use this beacon";

  return (
    <>
      <Layout
        navigation={
          uses.length > 0 && (
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

              {uses.length === 0 && (
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
                          uses.length.toString()
                        ),
                      })
                    }
                  />
                </>
              )}

              {uses.length > 0 && (
                <>
                  {uses.map((use, index) => {
                    return (
                      <AdditionalBeaconUseSummary
                        index={index}
                        use={use}
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
                          uses.length.toString()
                        ),
                      })
                    }
                    classes="govuk-button--secondary"
                  />
                  <br />
                  <br />
                  <LinkButton
                    buttonText="Continue"
                    href={UrlBuilder.updateRegistrationSummaryPath(
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
        useIndex: index,
        onSuccess: UrlBuilder.buildUseSummaryUrl(
          Actions.update,
          registrationId
        ),
        onFailure: ErrorPageURLs.serverError,
      }),
    no: UrlBuilder.buildUseSummaryUrl(Actions.update, registrationId),
  });

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const registrationId = context.query.registrationId as string;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
        context,
        registrationId
      ),
      new GivenUserIsEditingADraftRegistration_ThenMakeTheDraftRegistrationAvailable(
        context,
        props(context)
      ),
    ]).execute();
  })
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<UseSummaryProps>> => {
  const draftRegistration = await context.container.getDraftRegistration(
    context.req.cookies[formSubmissionCookieId]
  );

  return {
    uses: draftRegistration.uses,
  };
};

export default AdditionalBeaconUse;
