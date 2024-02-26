import { GetServerSidePropsResult } from "next";
import { clearFormSubmissionCookie } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import {
  deleteCachedRegistrationForAccountHolder,
  deleteCachedRegistrationsForAccountHolder,
} from "../../useCases/deleteCachedRegistrationsForAccountHolder";
import { Rule } from "./Rule";
import { getDraftRegistration } from "../../useCases/getDraftRegistration";
import logger from "../../logger";

export class GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    if (this.thereIsNoDraftRegistrationCookieSet()) return false;

    return this.theDraftRegistrationCookieIdDoesNotMatchTheQueryId();
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const {
      getAccountHolderId,
      draftRegistrationGateway,
      accountHolderGateway,
    } = this.context.container;

    const accountHolderId = await getAccountHolderId(this.context.session);

    await this.context.container.deleteDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId]
    );

    let registrationId = this.context.params?.registrationId.toString();

    await deleteCachedRegistrationForAccountHolder(
      draftRegistrationGateway,
      accountHolderGateway,
      accountHolderId,
      registrationId
    );

    clearFormSubmissionCookie(this.context);

    return redirectUserTo(this.context.req.url);
  }

  private thereIsNoDraftRegistrationCookieSet() {
    return !this.context.req.cookies[formSubmissionCookieId];
  }

  private theDraftRegistrationCookieIdDoesNotMatchTheQueryId() {
    return (
      this.context.req.cookies[formSubmissionCookieId] !==
      this.context.params?.registrationId
    );
  }
}
