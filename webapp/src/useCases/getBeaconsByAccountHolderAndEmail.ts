import { AccountListBeacon } from "../entities/AccountListBeacon";
import { IAppContainer } from "../lib/IAppContainer";
import { formatDateTruncated, titleCase } from "../lib/writingStyle";
import { BeaconSearchSortOptions } from "../gateways/interfaces/BeaconSearchGateway";

export type GetBeaconsForAccountHolderFn = (
  accountId: string,
  email: string,
  sortOptions: BeaconSearchSortOptions,
) => Promise<AccountListBeacon[]>;

export const getBeaconsForAccountHolder =
  ({ beaconSearchGateway }: IAppContainer): GetBeaconsForAccountHolderFn =>
  async (
    accountId: string,
    email: string,
    sortOptions: BeaconSearchSortOptions,
  ): Promise<AccountListBeacon[]> => {
    const beacons = await beaconSearchGateway.getBeaconsByAccountHolderAndEmail(
      accountId,
      email,
      sortOptions,
    );

    return beacons
      .filter(({ beaconStatus }) =>
        ["NEW", "CHANGE", "MIGRATED"].includes(beaconStatus),
      )
      .map((beacon) => ({
        id: beacon.id,
        createdDate: formatDateTruncated(beacon.createdDate),
        lastModifiedDate: formatDateTruncated(beacon.lastModifiedDate),
        beaconStatus: beacon.beaconStatus,
        hexId: beacon.hexId,
        ownerName: titleCase(beacon.ownerName),
        mainUse: beacon.mainUseName,
        uses: titleCase(beacon.useActivities),
      }));
  };
