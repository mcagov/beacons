import { GetServerSidePropsResult } from "next";
import { clearFormSubmissionCookie } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { deleteCachedRegistrationForAccountHolder } from "../../useCases/deleteCachedRegistrationsForAccountHolder";
import { Rule } from "./Rule";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { Registration } from "../../entities/Registration";
import { isEqual } from "lodash";
export class GivenUserHasCompletedADraftRegistrationOrUpdatedAnExistingRegistration_ThenDeleteItAndReloadPage
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    return (
      this.hasCompletedDraftRegistration() ||
      this.hasUpdatedAnExistingRegistration()
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
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

    clearFormSubmissionCookie(this.context);

    return redirectUserTo(this.context.req.url);
  }

  private hasCompletedDraftRegistration() {
    return (
      this.theDraftRegistrationCookieIdDoesMatchTheQueryId() &&
      this.isHttpPostRequest()
    );
  }

  private async hasUpdatedAnExistingRegistration() {
    const {
      getAccountHoldersRegistration,
      getDraftRegistration,
      getAccountHolderId,
    } = this.context.container;

    const registrationId = this.context.params.registrationId as string;

    const draftRegistration: DraftRegistration =
      await getDraftRegistration(registrationId);

    if (!draftRegistration) return false;

    const accountHolderId: string = await getAccountHolderId(
      this.context.session,
    );

    const existingRegistration: Registration =
      await getAccountHoldersRegistration(registrationId, accountHolderId);

    return (
      !isEqual(existingRegistration, draftRegistration) &&
      this.isHttpPostRequest()
    );
  }

  private isHttpPostRequest(): boolean {
    return this.context.req.method === "POST";
  }

  private draftRegistrationId(): string {
    return this.context.req.cookies[formSubmissionCookieId];
  }

  private theDraftRegistrationCookieIdDoesMatchTheQueryId() {
    return this.draftRegistrationId() === this.context.params?.registrationId;
  }
}
