import { GetServerSidePropsResult } from "next";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../lib/types";
import { deleteCachedRegistrationForAccountHolder } from "../../useCases/deleteCachedRegistrationsForAccountHolder";
import { Rule } from "./Rule";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { Registration } from "../../entities/Registration";
import { isEqual } from "lodash";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { clearFormSubmissionCookie } from "../../lib/middleware";
export class GivenUserHasCompletedADraftRegistrationOrUpdatedAnExistingRegistration_ThenDeleteIt
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    if (this.thereIsNoDraftRegistrationCookieSet()) return false;

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

    // clearFormSubmissionCookie(this.context);

    return redirectUserTo(this.context.req.url);
  }

  private hasCompletedDraftRegistration() {
    return (
      this.theDraftRegistrationCookieIdDoesMatchTheQueryId() &&
      this.userSubmittedForm()
    );
  }

  private async hasUpdatedAnExistingRegistration() {
    const {
      getAccountHoldersRegistration,
      getDraftRegistration,
      getAccountHolderId,
    } = this.context.container;

    const registrationId = this.context.params.registrationId as string;
    console.log("context: ", this.context.res);

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
      this.userSubmittedForm()
    );
  }

  private userSubmittedForm(): boolean {
    return (
      this.context.req.method === "POST" || this.context.req.method === "PATCH"
    );
  }

  private draftRegistrationId(): string {
    return this.context.req.cookies[formSubmissionCookieId];
  }

  private theDraftRegistrationCookieIdDoesMatchTheQueryId() {
    return this.draftRegistrationId() === this.context.params?.registrationId;
  }

  private thereIsNoDraftRegistrationCookieSet() {
    return !this.context.req.cookies[formSubmissionCookieId];
  }
}
