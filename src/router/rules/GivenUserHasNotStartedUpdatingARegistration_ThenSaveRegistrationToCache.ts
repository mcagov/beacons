import { GetServerSidePropsResult } from "next";
import { Registration } from "../../entities/Registration";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { Rule } from "./Rule";

export class GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    const registrationId = this.context.query.id;

    return this.context.req?.cookies[formSubmissionCookieId] !== registrationId;
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const {
      getAccountHoldersRegistration,
      getAccountHolderId,
      saveDraftRegistration,
    } = this.context.container;

    const registrationId = this.context.query.id as string;

    const accountHolderId = await getAccountHolderId(this.context.session);

    const registration: Registration = await getAccountHoldersRegistration(
      registrationId,
      accountHolderId
    );

    await saveDraftRegistration(registrationId, registration);

    return redirectUserTo(this.context.req.url);
  }
}
