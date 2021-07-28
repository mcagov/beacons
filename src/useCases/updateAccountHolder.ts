import { AccountHolder } from "../entities/AccountHolder";
import { IAppContainer } from "../lib/IAppContainer";

export type UpdateAccountHolderFn = (
  id: string,
  accountHolderUpdate: AccountHolder
) => Promise<AccountHolder>;

export const updateAccountHolder =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): UpdateAccountHolderFn =>
  async (
    id: string,
    accountHolderUpdate: AccountHolder
  ): Promise<AccountHolder> => {
    const accessToken = await getAccessToken();
    const updatedAccountHolder =
      await accountHolderApiGateway.updateAccountHolderDetails(
        id,
        accountHolderUpdate,
        accessToken
      );

    return updatedAccountHolder;
  };
