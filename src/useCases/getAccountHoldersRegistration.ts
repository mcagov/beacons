import { Registration } from "../entities/Registration";
import { beaconToRegistration } from "../lib/beaconToRegistration";
import { IAppContainer } from "../lib/IAppContainer";

export const getAccountHoldersRegistration =
  ({ accountHolderGateway }: IAppContainer) =>
  async (
    registrationId: string,
    accountHolderId: string
  ): Promise<Registration> => {
    const beacons = await accountHolderGateway.getAccountBeacons(
      accountHolderId
    );
    const beacon = beacons.find((beacon) => beacon.id === registrationId);
    return beaconToRegistration(beacon);
  };
