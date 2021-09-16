import { GetServerSidePropsResult } from "next";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { queryParams } from "../../lib/urls";
import { Rule } from "./Rule";

export class GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse
  implements Rule
{
  private readonly context: BeaconsGetServerSidePropsContext;

  constructor(context: BeaconsGetServerSidePropsContext) {
    this.context = context;
  }

  public async condition(): Promise<boolean> {
    return this.userHasNotSpecifiedAUse();
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    if (await this.draftUsesExist()) return this.sendUserToHighestUseId();

    return this.createNewUseAndRedirectToIt();
  }

  private userHasNotSpecifiedAUse() {
    return !this.context?.query?.useId;
  }

  private async draftUsesExist() {
    return (await this.draftRegistration())?.uses?.length > 0;
  }

  private async sendUserToHighestUseId(): Promise<
    GetServerSidePropsResult<any>
  > {
    const urlHasQueryParams = this.context.req.url.includes("?");

    if (urlHasQueryParams) {
      return redirectUserTo(
        this.context.req.url +
          queryParams({
            useId: (await this.draftRegistration()).uses.length - 1,
          }).replace("?", "&")
      );
    }

    return redirectUserTo(
      this.context.req.url +
        queryParams({
          useId: (await this.draftRegistration()).uses.length - 1,
        })
    );
  }

  private async createNewUseAndRedirectToIt(): Promise<
    GetServerSidePropsResult<any>
  > {
    const { addNewUseToDraftRegistration } = this.context.container;

    await addNewUseToDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId]
    );

    return redirectUserTo(this.context.req.url + queryParams({ useId: 0 }));
  }

  private async draftRegistration(): Promise<DraftRegistration> {
    return await this.context.container.getDraftRegistration(
      this.context.req.cookies[formSubmissionCookieId]
    );
  }
}
