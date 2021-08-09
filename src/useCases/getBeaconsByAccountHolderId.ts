import { Beacon } from "../entities/Beacon";
import { IAppContainer } from "../lib/IAppContainer";

export type GetBeaconsByAccountHolderIdFn = (
  accountId: string
) => Promise<Beacon[]>;

export const getBeaconsByAccountHolderId =
  ({ accountHolderGateway }: IAppContainer): GetBeaconsByAccountHolderIdFn =>
  async (accountId: string) => {
    return await accountHolderGateway.getAccountBeacons(accountId);
  };
