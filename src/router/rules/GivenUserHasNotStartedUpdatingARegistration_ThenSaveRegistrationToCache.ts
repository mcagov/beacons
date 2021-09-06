import { GetServerSidePropsResult } from "next";
import { Registration } from "../../entities/Registration";
import { setCookie } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { Rule } from "./Rule";

export class GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;
  private readonly registrationId: string;

  constructor(
    context: BeaconsGetServerSidePropsContext,
    registrationId: string
  ) {
    this.context = context;
    this.registrationId = registrationId;
  }

  public async condition(): Promise<boolean> {
    return (
      this.context.req?.cookies[formSubmissionCookieId] !== this.registrationId
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const {
      getAccountHoldersRegistration,
      getAccountHolderId,
      saveDraftRegistration,
    } = this.context.container;

    const accountHolderId = await getAccountHolderId(this.context.session);

    const registration: Registration = await getAccountHoldersRegistration(
      this.registrationId,
      accountHolderId
    );

    await saveDraftRegistration(this.registrationId, registration);

    setCookie(this.context.res, formSubmissionCookieId, this.registrationId);

    return redirectUserTo(this.context.req.url);
  }
}
