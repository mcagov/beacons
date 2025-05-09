import { Registration } from "../entities/Registration";
import { beaconToRegistration } from "../lib/beaconToRegistration";
import { IAppContainer } from "../lib/IAppContainer";
import logger from "../logger";

export type GetAccountHoldersRegistrationsFn = (
  registrationId: string,
  accountHolderId: string,
) => Promise<Registration[]>;

export type GetAccountHoldersRegistrationFn = (
  registrationId: string,
  accountHolderId: string,
) => Promise<Registration>;

export const getAccountHoldersRegistration =
  ({ accountHolderGateway }: IAppContainer) =>
  async (
    registrationId: string,
    accountHolderId: string,
  ): Promise<Registration> => {
    const beacon = await accountHolderGateway.getAccountBeacon(
      accountHolderId,
      registrationId,
    );
    logger.info(`getAccountHoldersRegistration - Beacon ID: ${beacon.id}`);
    logger.info(
      `getAccountHoldersRegistration - Registration Id: ${registrationId}`,
    );

    return beaconToRegistration(beacon);
  };

export const getAccountHoldersRegistrations =
  ({ accountHolderGateway }: IAppContainer) =>
  async (
    registrationId: string,
    accountHolderId: string,
  ): Promise<Registration[]> => {
    const beacons =
      await accountHolderGateway.getAccountBeacons(accountHolderId);
    logger.info(
      `getAccountHoldersRegistration - Beacons Len: ${beacons.length}`,
    );
    logger.info(
      `getAccountHoldersRegistration - Registration Id: ${registrationId}`,
    );
    return beacons.map((beacon) => beaconToRegistration(beacon));
  };
