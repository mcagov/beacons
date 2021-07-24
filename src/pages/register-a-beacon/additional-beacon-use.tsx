import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../../components/Button";
import { BeaconUseSection } from "../../components/domain/BeaconUseSection";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { GovUKBody, PageHeading } from "../../components/Typography";
import { showCookieBanner } from "../../lib/cookies";
import { withCookiePolicy } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { BeaconUse, IRegistration } from "../../lib/registration/types";
import { retrieveUserFormSubmissionId } from "../../lib/retrieveUserFormSubmissionId";
import { ActionURLs, PageURLs, queryParams } from "../../lib/urls";
import { prettyUseName } from "../../lib/writingStyle";

interface AdditionalBeaconUseProps {
  uses: BeaconUse[];
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
                PageURLs.moreDetails +
                queryParams({
                  useIndex: currentUseIndex || uses.length - 1,
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
                    href={PageURLs.environment}
                  />
                </>
              )}

              {uses.length > 0 && (
                <>
                  {uses.map((use, index) => {
                    return (
                      <BeaconUseSection
                        index={index}
                        use={use}
                        changeUri={PageURLs.environment + "?useIndex=" + index}
                        deleteUri={confirmBeforeDelete(use, index)}
                        key={`row${index}`}
                      />
                    );
                  })}
                  <LinkButton
                    buttonText="Add another use for this beacon"
                    href={PageURLs.environment + "?useIndex=" + uses.length}
                    classes="govuk-button--secondary"
                  />
                  <br />
                  <br />
                  <LinkButton
                    buttonText="Continue"
                    href={PageURLs.aboutBeaconOwner}
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

const confirmBeforeDelete = (use, index) =>
  PageURLs.areYouSure +
  queryParams({
    action: "delete your " + prettyUseName(use) + " use",
    yes:
      ActionURLs.deleteCachedUse +
      queryParams({
        useIndex: index,
        onSuccess:
          PageURLs.additionalUse +
          queryParams({
            useIndex: index >= 1 ? index - 1 : 0,
          }),
        onFailure: PageURLs.serverError,
      }),
    no: PageURLs.additionalUse + queryParams({ useIndex: index }),
  });

export const getServerSideProps: GetServerSideProps = withCookiePolicy(
  withSession(
    withContainer(async (context: BeaconsGetServerSidePropsContext) => {
      const { getDraftRegistration } = context.container;

      const submissionId = retrieveUserFormSubmissionId(context);
      const registration = (
        await getDraftRegistration(submissionId)
      ).getRegistration();

      if (
        registration.uses.length >= 1 &&
        currentUseIndexDoesNotExist(context, registration)
      )
        throw new ReferenceError(
          PageURLs.additionalUse +
            " was accessed with a useIndex parameter that does not exist on the cached registration."
        );

      return {
        props: {
          currentUseIndex: context.query.useIndex,
          uses: registration.uses,
          showCookieBanner: showCookieBanner(context),
        },
      };
    })
  )
);

const currentUseIndexDoesNotExist = (
  context: BeaconsGetServerSidePropsContext,
  registration: IRegistration
): boolean =>
  parseInt(context.query.useIndex as string) > registration.uses.length - 1;

export default AdditionalBeaconUse;
