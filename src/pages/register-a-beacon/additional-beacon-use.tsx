import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { BackButton, LinkButton } from "../../components/Button";
import { BeaconUseSection } from "../../components/domain/BeaconUseSection";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { PageHeading } from "../../components/Typography";
import {
  BeaconsGetServerSidePropsContext,
  withContainer,
} from "../../lib/container";
import { FormPageProps } from "../../lib/handlePageRequest";
import { retrieveUserFormSubmissionId } from "../../lib/retrieveUserFormSubmissionId";
import { PageURLs } from "../../lib/urls";
import { getCachedRegistration } from "../../useCases/getCachedRegistration";

const AdditionalBeaconUse: FunctionComponent<FormPageProps> = ({
  registration,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
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

              {registration.uses.map((use, index) => (
                <BeaconUseSection index={index} use={use} key={`row${index}`} />
              ))}

              {registration.uses.length === 0 && (
                <LinkButton
                  buttonText="Add a use for this beacon"
                  href={PageURLs.environment}
                />
              )}

              {registration.uses.length > 0 && (
                <>
                  <Link
                    href={
                      PageURLs.environment +
                      "?useIndex=" +
                      registration.uses.length
                    }
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
                    href={PageURLs.checkYourAnswers}
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
    const registration = await getCachedRegistration(submissionId);

    return {
      props: {
        registration,
      },
    };
  }
);

export default AdditionalBeaconUse;
