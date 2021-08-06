import { Beacon } from "../entities/Beacon";
import { IAppContainer } from "../lib/IAppContainer";

export type GetBeaconsByAccountHolderIdFn = (
  accountId: string
) => Promise<Beacon[]>;

export const getBeaconsByAccountHolderId =
  ({ accountHolderApiGateway }: IAppContainer): GetBeaconsByAccountHolderIdFn =>
  async (accountId: string) => {
    return await accountHolderApiGateway.getAccountBeacons(accountId);
  };
