import { GetServerSidePropsResult } from "next";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { GeneralPageURLs } from "../../lib/urls";
import { Rule } from "./Rule";
import { formSubmissionCookieId } from "../../lib/types";
import { verifyFormSubmissionCookieIsSet } from "../../lib/cookies";
import { DraftRegistration } from "../../entities/DraftRegistration";
import {
  clearFormSubmissionCookie,
  parseFormDataAs,
} from "../../lib/middleware";
import logger from "../../logger";
import { deleteCachedRegistrationForAccountHolder } from "../../useCases/deleteCachedRegistrationsForAccountHolder";

export class WhenUserSubmitsADraftRegistration implements Rule {
  constructor(private readonly context: BeaconsGetServerSidePropsContext) {}

  public async condition(): Promise<boolean> {
    if (this.thereIsNoDraftRegistrationCookieSet()) return false;

    return this.isHttpGetRequest();
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    /* Retrieve injected use case(s) */
    const { getDraftRegistration, submitRegistration, getAccountHolderId } =
      this.context.container;

    /* Page logic */
    if (!verifyFormSubmissionCookieIsSet(this.context))
      return redirectUserTo(GeneralPageURLs.start);

    const draftRegistration: DraftRegistration = await getDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId],
    );

    try {
      const result = await submitRegistration(
        draftRegistration,
        await getAccountHolderId(this.context.session),
      );
      const data = await parseFormDataAs(this.context.req);
      console.log("parseFormDataAs: ", data);
      clearFormSubmissionCookie(this.context);

      if (result.beaconRegistered) {
        await this.deleteCachedRegistration();
        logger.info(
          `Cached registration with hexId ${draftRegistration.hexId} and formSubmissionCookieId ${this.context.req.cookies[formSubmissionCookieId]} has been removed from redis.`,
        );
      } else {
        logger.error(
          `Failed to register beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${this.context.req.cookies[formSubmissionCookieId]}`,
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
        `Threw error when registering beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${this.context.req.cookies[formSubmissionCookieId]}`,
      );
      return {
        props: {
          registrationSuccess: false,
          confirmationEmailSuccess: false,
        },
      };
    }
  }

  private isHttpGetRequest(): boolean {
    return this.context.req.method === "GET";
  }

  private async deleteCachedRegistration(): Promise<void> {
    const {
      getAccountHolderId,
      draftRegistrationGateway,
      accountHolderGateway,
    } = this.context.container;

    const accountHolderId = await getAccountHolderId(this.context.session);

    await this.context.container.deleteDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId],
    );

    const registrationId: string = this.context.req.cookies[
      formSubmissionCookieId
    ] as string;

    await deleteCachedRegistrationForAccountHolder(
      draftRegistrationGateway,
      accountHolderGateway,
      accountHolderId,
      registrationId,
    );
  }

  private thereIsNoDraftRegistrationCookieSet() {
    return !this.context.req.cookies[formSubmissionCookieId];
  }
}
