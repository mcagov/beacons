import { GetServerSidePropsResult } from "next";
import { AccountHolder } from "../../entities/AccountHolder";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { AccountPageURLs } from "../../lib/urls";
import { Rule } from "./Rule";

export class WhenWeDoNotKnowUserDetails_ThenAskUserForTheirDetails
  implements Rule
{
  constructor(private readonly context: BeaconsGetServerSidePropsContext) {}

  public async condition(): Promise<boolean> {
    const accountHolderDetails = await this.getAccountHolderDetails();

    if (accountHolderDetails.fullName == null) return true;
    if (accountHolderDetails.email == null) return true;
    if (accountHolderDetails.telephoneNumber == null) return true;
  }

  private async getAccountHolderDetails(): Promise<AccountHolder> {
    const { getOrCreateAccountHolder } = this.context.container;

    return getOrCreateAccountHolder(this.context.session);
  }

  public async action(): Promise<GetServerSidePropsResult<any>> {
    return redirectUserTo(AccountPageURLs.updateAccount);
  }
}
