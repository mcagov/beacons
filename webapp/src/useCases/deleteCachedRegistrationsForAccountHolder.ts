import { AccountHolderGateway } from "../gateways/interfaces/AccountHolderGateway";
import { DraftRegistrationGateway } from "../gateways/interfaces/DraftRegistrationGateway";

export const deleteCachedRegistrationsForAccountHolder = async (
  draftRegistrationGateway: DraftRegistrationGateway,
  accountHolderGateway: AccountHolderGateway,
  accountHolderId: string
): Promise<void> => {
  const beacons = await accountHolderGateway.getAccountBeacons(accountHolderId);

  await Promise.all(
    beacons.map((beacon) => draftRegistrationGateway.delete(beacon.id))
  );
};
