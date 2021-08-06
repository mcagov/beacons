import { AccountHolder } from "../entities/AccountHolder";
import { BeaconsSession } from "../gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../lib/IAppContainer";

export type GetOrCreateAccountHolderFn = (
  session: BeaconsSession
) => Promise<AccountHolder>;

export const getOrCreateAccountHolder =
  ({
    accountHolderApiGateway,
  }: Partial<IAppContainer>): GetOrCreateAccountHolderFn =>
  async (session: BeaconsSession): Promise<AccountHolder> => {
    const authId: string = session.user.authId;
    const email: string = session.user.email;

    const accountHolderId = await accountHolderApiGateway.getAccountHolderId(
      authId
    );

    if (accountHolderId)
      return await accountHolderApiGateway.getAccountHolderDetails(
        accountHolderId
      );

    return await accountHolderApiGateway.createAccountHolder(authId, email);
  };
