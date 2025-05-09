import { Beacon } from "../entities/Beacon";
import { IAppContainer } from "../lib/IAppContainer";

export type GetBeaconsByAccountHolderIdFn = (
  accountId: string,
) => Promise<Beacon[]>;

export type GetBeaconByAccountHolderIdFn = (
  accountId: string,
  registrationId: string,
) => Promise<Beacon>;

// Update to getBeaconByAccountHolderId
export const getBeaconsByAccountHolderId =
  ({ accountHolderGateway }: IAppContainer): GetBeaconsByAccountHolderIdFn =>
  async (accountId: string) => {
    return await accountHolderGateway.getAccountBeacons(accountId);
  };

export const getBeaconByAccountHolderId =
  ({ accountHolderGateway }: IAppContainer): GetBeaconByAccountHolderIdFn =>
  async (accountId: string, registrationId: string) => {
    return await accountHolderGateway.getAccountBeacon(
      accountId,
      registrationId,
    );
  };
