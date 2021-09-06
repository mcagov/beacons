import { GetServerSidePropsResult } from "next";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { Rule } from "./Rule";

export class GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage
  implements Rule
{
  private context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    return (
      this.context.req.cookies[formSubmissionCookieId] !==
      this.context.query?.id
    );
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    await this.context.container.deleteDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId]
    );

    return redirectUserTo(this.context.req.url);
  }
}
