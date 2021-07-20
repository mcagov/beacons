import { IAppContainer } from "./../lib/appContainer";

export type DeleteBeaconFn = (
  reason: string,
  beaconId: string,
  accountHolderId: string
) => Promise<IDeleteBeaconResult>;

export interface IDeleteBeaconResult {
  success: boolean;
}

export const deleteBeacon =
  ({ beaconsApiGateway, getAccessToken }: IAppContainer): DeleteBeaconFn =>
  async (reason, beaconId, accountHolderId) => {
    const accessToken = await getAccessToken();

    const success = await beaconsApiGateway.deleteBeacon(
      { reason, beaconId, accountHolderId },
      accessToken
    );
    return { success };
  };
