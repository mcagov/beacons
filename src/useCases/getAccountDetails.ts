import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetAccountDetailsFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<IAccountHolderDetails>;

export const getAccountDetails =
  ({
    getOrCreateAccountId,
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetAccountDetailsFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const accessToken = await getAccessToken();
    const accountId = await getOrCreateAccountId(context);
    const accountHolderDetails =
      await accountHolderApiGateway.getAccountHolderDetails(
        accountId,
        accessToken
      );
    return accountHolderDetails;
  };
