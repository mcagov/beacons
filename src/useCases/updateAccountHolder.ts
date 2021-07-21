import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";

export type UpdateAccountHolderFn = (
  id: string,
  accountHolderUpdate: IAccountHolderDetails
) => Promise<IAccountHolderDetails>;

export const updateAccountHolder =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): UpdateAccountHolderFn =>
  async (
    id: string,
    accountHolderUpdate: IAccountHolderDetails
  ): Promise<IAccountHolderDetails> => {
    const accessToken = await getAccessToken();
    const updatedAccountHolder =
      await accountHolderApiGateway.updateAccountHolderDetails(
        id,
        accountHolderUpdate,
        accessToken
      );

    return updatedAccountHolder;
  };
