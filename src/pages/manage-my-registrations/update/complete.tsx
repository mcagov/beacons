import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { ReturnToYourAccountSection } from "../../../components/domain/ReturnToYourAccountSection";
import { Grid } from "../../../components/Grid";
import { Layout } from "../../../components/Layout";
import { Panel } from "../../../components/Panel";
import { DraftRegistration } from "../../../entities/DraftRegistration";
import { verifyFormSubmissionCookieIsSet } from "../../../lib/cookies";
import { clearFormSubmissionCookie } from "../../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { redirectUserTo } from "../../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../../lib/types";
import { GeneralPageURLs } from "../../../lib/urls";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { IUpdateRegistrationResult } from "../../../useCases/updateRegistration";

interface ApplicationCompleteProps {
  reference: string;
  pageHeading: string;
}

const ApplicationCompletePage: FunctionComponent<ApplicationCompleteProps> = ({
  reference,
  pageHeading,
}: ApplicationCompleteProps): JSX.Element => {
  return (
    <>
      <Layout
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              <Panel title={pageHeading} reference={reference} />
              <ApplicationCompleteWhatNext />
              <ReturnToYourAccountSection />
            </>
          }
        />
      </Layout>
    </>
  );
};

const ApplicationCompleteWhatNext: FunctionComponent = (): JSX.Element => {
  // TODO: Implement email confirmation of update
  return (
    <>
      {/*<SectionHeading>What happens next</SectionHeading>*/}
      {/*<GovUKBody>*/}
      {/*  We have sent you an email confirming your registration has been updated*/}
      {/*</GovUKBody>*/}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const rule = new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(
      context
    );

    if (await rule.condition()) {
      return rule.action();
    }
    /* Retrieve injected use case(s) */
    const { getDraftRegistration, updateRegistration } = context.container;

    /* Page logic */
    if (!verifyFormSubmissionCookieIsSet(context))
      return redirectUserTo(GeneralPageURLs.start);

    try {
      const draftRegistration: DraftRegistration = await getDraftRegistration(
        context.req.cookies[formSubmissionCookieId]
      );

      const result = await updateRegistration(
        draftRegistration,
        draftRegistration.id
      );

      const pageHeading = (result: IUpdateRegistrationResult) => {
        if (result.beaconUpdated)
          return "Your beacon registration has been updated.";
        return "We could not update your registration. Please contact the Beacons Registry team.";
      };

      clearFormSubmissionCookie(context);

      return {
        props: {
          reference: result.referenceNumber,
          pageHeading: pageHeading(result),
        },
      };
    } catch {
      return {
        props: {
          reference: "",
          pageHeading:
            "There was an error while updating your beacon.  Please contact the Beacons Registry team.",
        },
      };
    }
  })
);

export default ApplicationCompletePage;
