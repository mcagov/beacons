import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/middleware/withContainer";

export type GetAccountHolderIdFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<string>;

export const getAccountHolderId =
  ({
    getSession,
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetAccountHolderIdFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const session = await getSession(context);
    const authId: string = session.user.authId;
    const accessToken = await getAccessToken();

    const accountHolderId = await accountHolderApiGateway.getAccountHolderId(
      authId,
      accessToken
    );

    return accountHolderId;
  };
