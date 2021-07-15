import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../../components/Button";
import { BeaconUseSection } from "../../components/domain/BeaconUseSection";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { GovUKBody, PageHeading } from "../../components/Typography";
import {
  BeaconsGetServerSidePropsContext,
  withContainer,
} from "../../lib/container";
import { showCookieBanner } from "../../lib/cookies";
import { withCookieRedirect } from "../../lib/middleware";
import { BeaconUse } from "../../lib/registration/types";
import { retrieveUserFormSubmissionId } from "../../lib/retrieveUserFormSubmissionId";
import { ActionURLs, PageURLs } from "../../lib/urls";
import { prettyUseName } from "../../lib/writingStyle";
import { buildAreYouSureQuery } from "../are-you-sure";

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
          <BackButton
            href={PageURLs.moreDetails + "?useIndex=" + currentUseIndex}
          />
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

const buildDeleteUseQuery = (
  useIndex: number,
  onSuccess: string,
  onFailure: string
): string =>
  "?" +
  new URLSearchParams({
    useIndex: useIndex.toString(),
    onSuccess,
    onFailure,
  }).toString();

export const buildAdditionalBeaconUseQuery = (useIndex: number) =>
  "?" + new URLSearchParams({ useIndex: useIndex.toString() }).toString();

const confirmBeforeDelete = (use, index) => {
  const action = "delete your " + prettyUseName(use) + " use";
  const yes =
    ActionURLs.deleteCachedUse +
    buildDeleteUseQuery(
      index,
      PageURLs.additionalUse + buildAdditionalBeaconUseQuery(index - 1),
      PageURLs.serverError
    );
  const no = PageURLs.additionalUse + "?useIndex=" + index;
  const consequences =
    "You will have the opportunity to review this change at the end.";

  return (
    PageURLs.areYouSure + buildAreYouSureQuery(action, yes, no, consequences)
  );
};

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const { getCachedRegistration } = context.container;

    const submissionId = retrieveUserFormSubmissionId(context);
    const registration = (
      await getCachedRegistration(submissionId)
    ).getRegistration();

    return {
      props: {
        currentUseIndex: context.query.useIndex,
        uses: registration.uses,
        showCookieBanner: showCookieBanner(context),
      },
    };
  })
);

export default AdditionalBeaconUse;
