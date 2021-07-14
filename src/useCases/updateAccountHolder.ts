import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";

export type UpdateAccountHolderFn = (
  accountHolderDetails: IAccountHolderDetails,
  accountHolderUpdate: IAccountHolderDetails
) => Promise<IAccountHolderDetails>;

export const updateAccountHolder =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): UpdateAccountHolderFn =>
  async (
    accountHolderDetails: IAccountHolderDetails,
    accountHolderUpdate: IAccountHolderDetails
  ) => {
    const accessToken = await getAccessToken();

    const updatedAccountHolder =
      await accountHolderApiGateway.updateAccountHolderDetails(
        accountHolderDetails.id,
        accountHolderUpdate,
        accessToken
      );

    return updatedAccountHolder;
  };
