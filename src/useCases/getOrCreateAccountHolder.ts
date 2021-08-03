import { AccountHolder } from "../entities/AccountHolder";
import { Session } from "../gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../lib/IAppContainer";

export type GetOrCreateAccountHolderFn = (
  session: Session
) => Promise<AccountHolder>;

export const getOrCreateAccountHolder =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetOrCreateAccountHolderFn =>
  async (session: Session): Promise<AccountHolder> => {
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
