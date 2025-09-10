import { GetServerSideProps } from "next";
import React, { type JSX } from "react";
import { ReturnToYourAccountSection } from "../../components/domain/ReturnToYourAccountSection";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { BeaconRegistryContactInfo } from "../../components/Mca";
import { PanelFailed } from "../../components/PanelFailed";
import { PanelSucceeded } from "../../components/PanelSucceeded";
import { GovUKBody } from "../../components/Typography";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { RedisDraftRegistrationGateway } from "../../gateways/RedisDraftRegistrationGateway";
import { verifyFormSubmissionCookieIsSet } from "../../lib/cookies";
import { clearFormSubmissionCookie } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { GeneralPageURLs } from "../../lib/urls";
import logger from "../../logger";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

const ApplicationCompletePage = (props: {
  reference: string;
  registrationSuccess: boolean;
  confirmationEmailSuccess: boolean;
}): JSX.Element => {
  const pageHeading = props.registrationSuccess
    ? "Beacon registration complete"
    : "Beacon registration failed";

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
              {props.registrationSuccess ? (
                <>
                  <PanelSucceeded
                    title={pageHeading}
                    reference={props.reference}
                  >
                    {props.confirmationEmailSuccess
                      ? "We have sent you a confirmation email."
                      : "We could not send you a confirmation email but we have registered your beacon under the following reference id."}
                  </PanelSucceeded>
                  <GovUKBody className="govuk-body">
                    Your application to register a UK 406 MHz beacon has been
                    received by the Maritime and Coastguard Beacon Registry
                    Team. You can now use your beacon.
                  </GovUKBody>
                </>
              ) : (
                <PanelFailed>
                  We could not save your registration. Please contact the Beacon
                  Registry team using the details below.
                </PanelFailed>
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
      context,
    );

    if (await rule.condition()) {
      return rule.action();
    }
    /* Retrieve injected use case(s) */
    const { getDraftRegistration, submitRegistration, getAccountHolderId } =
      context.container;

    /* Page logic */
    if (!verifyFormSubmissionCookieIsSet(context))
      return redirectUserTo(GeneralPageURLs.start);

    const draftRegistration: DraftRegistration = await getDraftRegistration(
      context.req.cookies[formSubmissionCookieId],
    );

    try {
      const result = await submitRegistration(
        draftRegistration,
        await getAccountHolderId(context.session),
      );

      const cookieId = context.req.cookies[formSubmissionCookieId];
 
      try {
        const redisGateway = new RedisDraftRegistrationGateway();
        await redisGateway.delete(cookieId);
        await redisGateway.delete(`jc:${cookieId}`);
        await redisGateway.delete(`jc:${cookieId}_t`);
        logger.info(`Deleted Redis entries `);
      } catch (redisError) {
        logger.error(`Error: ${redisError}`);
      }
      
      clearFormSubmissionCookie(context);

      if (!result.beaconRegistered) {
        logger.error(
          `Failed to register beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${context.req.cookies[formSubmissionCookieId]}`,
        );
      }

      return {
        props: {
          reference: result.referenceNumber,
          registrationSuccess: result.beaconRegistered,
          confirmationEmailSuccess: result.confirmationEmailSent,
        },
      };
    } catch (e) {
      logger.error(e);
      logger.error(
        `Threw error when registering beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${context.req.cookies[formSubmissionCookieId]}`,
      );
      return {
        props: {
          registrationSuccess: false,
          confirmationEmailSuccess: false,
        },
      };
    }
  }),
);

export default ApplicationCompletePage;
