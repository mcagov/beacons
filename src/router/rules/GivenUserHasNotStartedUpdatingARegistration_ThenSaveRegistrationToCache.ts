import { GetServerSidePropsResult } from "next";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
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

  action(): Promise<GetServerSidePropsResult<any>> {
    return Promise.resolve(undefined);
  }
}
