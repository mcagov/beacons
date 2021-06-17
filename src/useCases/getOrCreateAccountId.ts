import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetOrCreateAccountIdFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<string>;

export const getOrCreateAccountId =
  ({
    getSession,
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetOrCreateAccountIdFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const session = await getSession(context);
    const authId: string = session.user["id"];
    const accessToken = await getAccessToken();

    return (
      (await accountHolderApiGateway.getAccountHolderId(authId, accessToken)) ||
      (await accountHolderApiGateway.createAccountHolderId(authId, accessToken))
    );
  };
