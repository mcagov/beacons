import { AccountHolder } from "../entities/AccountHolder";
import { BeaconsSession } from "../gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../lib/IAppContainer";

export type GetOrCreateAccountHolderFn = (
  session: BeaconsSession
) => Promise<AccountHolder>;

export const getOrCreateAccountHolder =
  ({
    accountHolderGateway,
  }: Partial<IAppContainer>): GetOrCreateAccountHolderFn =>
  async (session: BeaconsSession): Promise<AccountHolder> => {
    const authId: string = session.user.authId;
    const email: string = session.user.email;

    const accountHolderId = await accountHolderGateway.getAccountHolderId(
      authId
    );

    if (accountHolderId)
      return await accountHolderGateway.getAccountHolderDetails(
        accountHolderId
      );

    return await accountHolderGateway.createAccountHolder(authId, email);
  };
