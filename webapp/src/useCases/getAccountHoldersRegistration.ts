import { Registration } from "../entities/Registration";
import { beaconToRegistration } from "../lib/beaconToRegistration";
import { IAppContainer } from "../lib/IAppContainer";
import logger from "../logger";

export type GetAccountHoldersRegistrationFn = (
  registrationId: string,
  accountHolderId: string
) => Promise<Registration>;

export const getAccountHoldersRegistration =
  ({ accountHolderGateway }: IAppContainer) =>
  async (
    registrationId: string,
    accountHolderId: string
  ): Promise<Registration> => {
    const beacons = await accountHolderGateway.getAccountBeacons(
      accountHolderId
    );
    logger.info(
      `getAccountHoldersRegistration - Beacons Len: ${beacons.length}`
    );
    logger.info(
      `getAccountHoldersRegistration - Registration Id: ${registrationId}`
    );
    const beacon = beacons.find((beacon) => beacon.id === registrationId);
    return beaconToRegistration(beacon);
  };
