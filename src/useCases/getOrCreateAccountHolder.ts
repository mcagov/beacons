import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/middleware/withContainer";

export type GetOrCreateAccountHolderFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<IAccountHolderDetails>;

export const getOrCreateAccountHolder =
  ({
    getSession,
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetOrCreateAccountHolderFn =>
  async (
    context: BeaconsGetServerSidePropsContext
  ): Promise<IAccountHolderDetails> => {
    const session = await getSession(context);
    const authId: string = session.user.authId;
    const email: string = session.user.email;
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
      email,
      accessToken
    );
  };
