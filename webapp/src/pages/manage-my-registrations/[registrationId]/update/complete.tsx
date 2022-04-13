import { GetServerSideProps } from "next";
import React from "react";
import { ReturnToYourAccountSection } from "../../../../components/domain/ReturnToYourAccountSection";
import { Grid } from "../../../../components/Grid";
import { Layout } from "../../../../components/Layout";
import { BeaconRegistryContactInfo } from "../../../../components/Mca";
import { PanelFailed } from "../../../../components/PanelFailed";
import { PanelSucceeded } from "../../../../components/PanelSucceeded";
import { GovUKBody } from "../../../../components/Typography";
import { DraftRegistration } from "../../../../entities/DraftRegistration";
import { verifyFormSubmissionCookieIsSet } from "../../../../lib/cookies";
import { clearFormSubmissionCookie } from "../../../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../lib/middleware/withContainer";
import { withSession } from "../../../../lib/middleware/withSession";
import { redirectUserTo } from "../../../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../../../lib/types";
import { GeneralPageURLs } from "../../../../lib/urls";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import logger from "../../../../utils/logger";

const ApplicationCompletePage = (props: {
  reference: string;
  updateSuccess: boolean;
}): JSX.Element => {
  const pageHeading = props.updateSuccess
    ? "Update succeeded"
    : "Update failed";

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
              {props.updateSuccess ? (
                <>
                  <PanelSucceeded
                    title="Your beacon registration has been updated"
                    reference={props.reference}
                  />
                  <GovUKBody className="govuk-body">
                    Your updated details have been received by the Maritime and
                    Coastguard Beacon Registry team. You can now use your
                    beacon.
                  </GovUKBody>
                </>
              ) : (
                <>
                  <PanelFailed>
                    We could not update your beacon. Please contact the Beacon
                    Registry team using the details below.
                  </PanelFailed>
                  <BeaconRegistryContactInfo />
                </>
              )}
              <BeaconRegistryContactInfo />
              <ReturnToYourAccountSection />
            </>
          }
        />
      </Layout>
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

    const draftRegistration: DraftRegistration = await getDraftRegistration(
      context.req.cookies[formSubmissionCookieId]
    );

    try {
      const result = await updateRegistration(
        draftRegistration,
        draftRegistration.id
      );

      clearFormSubmissionCookie(context);

      if (!result.beaconUpdated) {
        logger.error(
          `Failed to update beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${context.req.cookies[formSubmissionCookieId]}`
        );
      }

      return {
        props: {
          reference: result.referenceNumber,
          updateSuccess: result.beaconUpdated,
        },
      };
    } catch (e) {
      logger.error(
        `Threw error ${e} when updating beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${context.req.cookies[formSubmissionCookieId]}`
      );
      return {
        props: {
          updateSuccess: false,
        },
      };
    }
  })
);

export default ApplicationCompletePage;
