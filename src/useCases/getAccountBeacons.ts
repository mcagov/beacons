import { IBeacon } from "../entities/beacon";
import { IAppContainer } from "../lib/appContainer";

export type GetBeaconsByAccountHolderIdFn = (
  accountId: string
) => Promise<IBeacon[]>;

export const getBeaconsByAccountHolderId =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetBeaconsByAccountHolderIdFn =>
  async (accountId: string) => {
    const accessToken = await getAccessToken();
    const accountHolderDetails =
      await accountHolderApiGateway.getAccountBeacons(accountId, accessToken);
    return accountHolderDetails;
  };
