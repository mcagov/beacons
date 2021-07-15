import * as _ from "lodash";
import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IAppContainer } from "../lib/appContainer";
import { diffObjValues } from "../lib/utils";

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

    const update = diffObjValues(
      accountHolderDetails,
      _.omit(accountHolderUpdate, ["id"])
    ) as IAccountHolderDetails;

    const updatedAccountHolder =
      await accountHolderApiGateway.updateAccountHolderDetails(
        accountHolderDetails.id,
        update,
        accessToken
      );

    return updatedAccountHolder;
  };
