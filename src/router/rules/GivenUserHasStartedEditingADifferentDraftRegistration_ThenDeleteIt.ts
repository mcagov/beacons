import { GetServerSidePropsResult } from "next";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { formSubmissionCookieId } from "../../lib/types";
import { Rule } from "./Rule";

export class GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteIt
  implements Rule
{
  private context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  async condition(): Promise<boolean> {
    return (
      this.context.req.cookies[formSubmissionCookieId] !==
      this.context.query?.id
    );
  }

  action(): Promise<GetServerSidePropsResult<any>> {
    return Promise.resolve(undefined);
  }
}
