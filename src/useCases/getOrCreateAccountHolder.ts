import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { Session } from "../gateways/userSessionGateway";
import { IAppContainer } from "../lib/appContainer";

export type GetOrCreateAccountHolderFn = (
  session: Session
) => Promise<IAccountHolderDetails>;

export const getOrCreateAccountHolder =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetOrCreateAccountHolderFn =>
  async (session: Session): Promise<IAccountHolderDetails> => {
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
