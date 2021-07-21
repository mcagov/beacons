import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/middleware/BeaconsGetServerSidePropsContext";

export type GetAccountHolderIdFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<string>;

export const getAccountHolderId =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetAccountHolderIdFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const authId: string = context.session.user.authId;
    const accessToken = await getAccessToken();

    return await accountHolderApiGateway.getAccountHolderId(
      authId,
      accessToken
    );
  };
