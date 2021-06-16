import { IAccountHolderDetails } from "../lib/accountHolder/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetAccountDetailsFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<IAccountHolderDetails>;

export const getAccountDetails =
  ({
    getSession,
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetAccountDetailsFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const session = await getSession(context);
    const accessToken = await getAccessToken();
    const accountId = await accountHolderApiGateway.getAccountHolderId(
      session.user["id"],
      accessToken
    );
    const accountHolderDetails =
      await accountHolderApiGateway.getAccountHolderDetails(
        accountId,
        accessToken
      );
    return accountHolderDetails;
  };
