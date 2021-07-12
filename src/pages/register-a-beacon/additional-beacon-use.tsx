import { GetServerSideProps } from "next";
import Link from "next/link";
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
import { BeaconUse } from "../../lib/registration/types";
import { retrieveUserFormSubmissionId } from "../../lib/retrieveUserFormSubmissionId";
import { PageURLs } from "../../lib/urls";
import { getCachedRegistration } from "../../useCases/getCachedRegistration";

interface AdditionalBeaconUseProps {
  uses: BeaconUse[];
  showCookieBanner?: boolean;
}

const AdditionalBeaconUse: FunctionComponent<AdditionalBeaconUseProps> = ({
  uses,
  showCookieBanner = false,
}: AdditionalBeaconUseProps): JSX.Element => {
  const pageHeading = "Summary of how you use this beacon";

  return (
    <>
      <Layout
        navigation={<BackButton href={PageURLs.moreDetails} />}
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
                  {uses.map((use, index) => (
                    <BeaconUseSection
                      index={index}
                      use={use}
                      key={`row${index}`}
                    />
                  ))}

                  <Link
                    href={PageURLs.environment + "?useIndex=" + uses.length}
                  >
                    <a
                      role="button"
                      draggable="false"
                      className="govuk-button govuk-button--secondary"
                      data-module="govuk-button"
                    >
                      Add another use for this beacon
                    </a>
                  </Link>
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

// const onSuccessfulFormCallback: DestinationIfValidCallback = async (
//   context: BeaconsContext
// ) => {
//   const shouldCreateAdditionalUse =
//     context.formData.additionalBeaconUse === "true";
//
//   if (shouldCreateAdditionalUse) {
//     const registration = await FormCacheFactory.getCache().get(
//       context.submissionId
//     );
//     registration.createUse();
//     await setFormCache(context.submissionId, registration);
//
//     const useIndex = registration.getRegistration().uses.length - 1;
//
//     return formatUrlQueryParams("/register-a-beacon/beacon-use", { useIndex });
//   } else {
//     return "/register-a-beacon/about-beacon-owner";
//   }
// };

export const getServerSideProps: GetServerSideProps = withContainer(
  async (context: BeaconsGetServerSidePropsContext) => {
    const submissionId = retrieveUserFormSubmissionId(context);
    const registration = (
      await getCachedRegistration(submissionId)
    ).getRegistration();

    return {
      props: {
        uses: registration.uses,
      },
    };
  }
);

export default AdditionalBeaconUse;
