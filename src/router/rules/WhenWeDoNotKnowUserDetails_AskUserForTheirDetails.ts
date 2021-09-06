import { GetServerSidePropsResult } from "next";
import { AccountHolder } from "../../entities/AccountHolder";
import { FormManagerFactory } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { AccountPageURLs } from "../../lib/urls";
import { Rule } from "./Rule";

export class WhenWeDoNotKnowUserDetails_AskUserForTheirDetails implements Rule {
  constructor(
    private readonly context: BeaconsGetServerSidePropsContext,
    private readonly validationRules: FormManagerFactory
  ) {}

  public async condition(): Promise<boolean> {
    const accountHolderDetails = await this.getAccountHolderDetails();

    return this.validationRules(accountHolderDetails).asDirty().hasErrors();
  }

  private async getAccountHolderDetails(): Promise<AccountHolder> {
    const { getOrCreateAccountHolder } = this.context.container;

    return getOrCreateAccountHolder(this.context.session);
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return redirectUserTo(AccountPageURLs.updateAccount);
  }
}
