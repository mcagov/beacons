import { Beacon } from "../entities/Beacon";
import { IAppContainer } from "../lib/IAppContainer";

export type GetBeaconsByAccountHolderIdFn = (
  accountId: string
) => Promise<Beacon[]>;

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
