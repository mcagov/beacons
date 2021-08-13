import { AccountHolder } from "../entities/AccountHolder";
import { IAppContainer } from "../lib/IAppContainer";

export type UpdateAccountHolderFn = (
  id: string,
  accountHolderUpdate: AccountHolder
) => Promise<AccountHolder>;

export const updateAccountHolder =
  ({ accountHolderGateway }: IAppContainer): UpdateAccountHolderFn =>
  async (
    id: string,
    accountHolderUpdate: AccountHolder
  ): Promise<AccountHolder> => {
    return await accountHolderGateway.updateAccountHolderDetails(
      id,
      accountHolderUpdate
    );
  };
