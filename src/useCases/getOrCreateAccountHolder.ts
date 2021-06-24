import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetOrCreateAccountHolderFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<IAccountHolderDetails>;

export const getOrCreateAccountHolder =
  ({
    getSession,
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetOrCreateAccountHolderFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const session = await getSession(context);
    const authId: string = session.user["id"];
    const accessToken = await getAccessToken();

    const accountHolderId = await accountHolderApiGateway.getAccountHolderId(
      authId,
      accessToken
    );

    if (accountHolderId)
      return await accountHolderApiGateway.getAccountHolderDetails(
        accountHolderId,
        accessToken
      );

    return await accountHolderApiGateway.createAccountHolder(
      authId,
      accessToken
    );
  };
