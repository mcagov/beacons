import { IAppContainer } from "../lib/IAppContainer";

export type DeleteBeaconFn = (
  reason: string,
  beaconId: string,
  accountHolderId: string
) => Promise<IDeleteBeaconResult>;

export interface IDeleteBeaconResult {
  success: boolean;
}

export const deleteBeacon =
  ({ beaconsApiGateway }: IAppContainer): DeleteBeaconFn =>
  async (reason, beaconId, accountHolderId) => {
    const success = await beaconsApiGateway.deleteBeacon({
      reason,
      beaconId,
      accountHolderId,
    });
    return { success };
  };
