import { GetServerSideProps } from "next";
import React, { FunctionComponent, type JSX } from "react";
import { BackButton, LinkButton } from "../../components/Button";
import { AdditionalBeaconUseSummary } from "../../components/domain/AdditionalBeaconUseSummary";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { GovUKBody, PageHeading } from "../../components/Typography";
import { DraftBeaconUse } from "../../entities/DraftBeaconUse";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import {
  ActionURLs,
  CreateRegistrationPageURLs,
  ErrorPageURLs,
  GeneralPageURLs,
  queryParams,
} from "../../lib/urls";
import { prettyUseName } from "../../lib/writingStyle";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage";
import { GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIdOrCreateNewUse } from "../../router/rules/GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIdOrCreateNewUse";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { WhenUserViewsPage_ThenDisplayPage } from "../../router/rules/WhenUserViewsPage_ThenDisplayPage";

interface AdditionalBeaconUseProps {
  uses: DraftBeaconUse[];
  currentUseId: number;
  showCookieBanner?: boolean;
}

const AdditionalBeaconUse: FunctionComponent<AdditionalBeaconUseProps> = ({
  uses,
  currentUseId,
  showCookieBanner,
}: AdditionalBeaconUseProps): JSX.Element => {
  const pageHeading = "Summary of how you use this beacon";

  return (
    <>
      <Layout
        navigation={
          uses.length > 0 && (
            <BackButton
              href={
                CreateRegistrationPageURLs.moreDetails +
                queryParams({
                  useId: currentUseId,
                })
              }
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
                    href={ActionURLs.addNewUseToDraftRegistration}
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
                        changeUri={
                          CreateRegistrationPageURLs.environment +
                          "?useId=" +
                          index
                        }
                        deleteUri={confirmBeforeDelete(use, index)}
                        key={`row${index}`}
                      />
                    );
                  })}
                  <LinkButton
                    buttonText="Add another use for this beacon"
                    href={ActionURLs.addNewUseToDraftRegistration}
                    classes="govuk-button--secondary"
                  />
                  <br />
                  <br />
                  <LinkButton
                    buttonText="Continue"
                    href={CreateRegistrationPageURLs.aboutBeaconOwner}
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

const confirmBeforeDelete = (use: DraftBeaconUse, index: number) =>
  GeneralPageURLs.areYouSure +
  queryParams({
    action: "delete your " + prettyUseName(use) + " use",
    yes:
      ActionURLs.deleteCachedUse +
      queryParams({
        useId: index,
        onSuccess:
          CreateRegistrationPageURLs.additionalUse +
          queryParams({
            useId: index >= 1 ? index - 1 : 0,
          }),
        onFailure: ErrorPageURLs.serverError,
      }),
    no:
      CreateRegistrationPageURLs.additionalUse + queryParams({ useId: index }),
  });

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIdOrCreateNewUse(
        context,
      ),
      new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage(
        context,
      ),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
    ]).execute();
  }),
);

const props = async (
  context: BeaconsGetServerSidePropsContext,
): Promise<Partial<AdditionalBeaconUseProps>> => {
  const draftRegistration = await context.container.getDraftRegistration(
    context.req.cookies[formSubmissionCookieId],
  );

  const useId = parseInt(context.query.useId as string);

  return {
    uses: draftRegistration.uses,
    currentUseId: useId,
  };
};

export default AdditionalBeaconUse;
