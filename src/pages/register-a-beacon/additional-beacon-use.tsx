import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
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
  queryParams,
} from "../../lib/urls";
import { prettyUseName } from "../../lib/writingStyle";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserDoesNotHaveValidSession } from "../../router/rules/IfUserDoesNotHaveValidSession";
import { IfUserHasNotSpecifiedAUse } from "../../router/rules/IfUserHasNotSpecifiedAUse";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { WhenUserViewsPage_ThenDisplayPage } from "../../router/rules/WhenUserViewsPage_ThenDisplayPage";

interface AdditionalBeaconUseProps {
  uses: DraftBeaconUse[];
  currentUseIndex: number;
  showCookieBanner?: boolean;
}

const AdditionalBeaconUse: FunctionComponent<AdditionalBeaconUseProps> = ({
  uses,
  currentUseIndex,
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
                  useIndex: currentUseIndex,
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
                          "?useIndex=" +
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
        useIndex: index,
        onSuccess:
          CreateRegistrationPageURLs.additionalUse +
          queryParams({
            useIndex: index >= 1 ? index - 1 : 0,
          }),
        onFailure: ErrorPageURLs.serverError,
      }),
    no:
      CreateRegistrationPageURLs.additionalUse +
      queryParams({ useIndex: index }),
  });

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserDoesNotHaveValidSession(context),
      new IfUserHasNotSpecifiedAUse(context),
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new WhenUserViewsPage_ThenDisplayPage(context, props(context)),
    ]).execute();
  })
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<AdditionalBeaconUseProps>> => {
  const draftRegistration = await context.container.getDraftRegistration(
    context.req.cookies[formSubmissionCookieId]
  );

  const useIndex = parseInt(context.query.useIndex as string);

  return {
    uses: draftRegistration.uses,
    currentUseIndex: useIndex,
  };
};

export default AdditionalBeaconUse;
