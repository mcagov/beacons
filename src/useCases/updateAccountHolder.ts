import { AccountHolder } from "../entities/AccountHolder";
import { IAppContainer } from "../lib/IAppContainer";

export type UpdateAccountHolderFn = (
  id: string,
  accountHolderUpdate: AccountHolder
) => Promise<AccountHolder>;

export const updateAccountHolder =
  ({ accountHolderApiGateway }: IAppContainer): UpdateAccountHolderFn =>
  async (
    id: string,
    accountHolderUpdate: AccountHolder
  ): Promise<AccountHolder> => {
    return await accountHolderApiGateway.updateAccountHolderDetails(
      id,
      accountHolderUpdate
    );
  };
