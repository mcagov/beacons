import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { queryParams } from "../../lib/urls";
import { Rule } from "./Rule";

export class UserViewedBeaconUseFormWithoutUseIndexRule implements Rule {
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    return this.context.req.method === "GET" && !this.context?.query?.useIndex;
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    const { getDraftRegistration } = this.context.container;

    const draftRegistration: DraftRegistration = await getDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId]
    );

    const draftUsesExist = draftRegistration?.uses?.length > 0;

    if (draftUsesExist) {
      return this.sendUserToHighestUseIndex(draftRegistration);
    }

    return this.createNewUseAndRedirectToIt();
  }

  private sendUserToHighestUseIndex(
    draftRegistration: DraftRegistration
  ): GetServerSidePropsResult<any> {
    return redirectUserTo(
      this.context.req.url +
        queryParams({ useIndex: draftRegistration.uses.length - 1 })
    );
  }

  private async createNewUseAndRedirectToIt(): Promise<
    GetServerSidePropsResult<any>
  > {
    const { addNewUseToDraftRegistration } = this.context.container;

    await addNewUseToDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId]
    );

    return redirectUserTo(this.context.req.url + queryParams({ useIndex: 0 }));
  }
}
