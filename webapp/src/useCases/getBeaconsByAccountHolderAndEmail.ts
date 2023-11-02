import { AccountListBeacon } from "../entities/AccountListBeacon";
import { IAppContainer } from "../lib/IAppContainer";
import { formatDateTruncated, titleCase } from "../lib/writingStyle";
import { BeaconSearchSortOptions } from "./../gateways/interfaces/BeaconSearchGateway";

export type GetBeaconsForAccountHolderFn = (
  accountId: string,
  email: string,
  sortOptions: BeaconSearchSortOptions
) => Promise<AccountListBeacon[]>;

export const getBeaconsForAccountHolder =
  ({ beaconSearchGateway }: IAppContainer): GetBeaconsForAccountHolderFn =>
  async (
    accountId: string,
    email: string,
    sortOptions: BeaconSearchSortOptions
  ): Promise<AccountListBeacon[]> => {
    const beacons = await beaconSearchGateway.getBeaconsByAccountHolderAndEmail(
      accountId,
      email,
      sortOptions
    );

    return (
      beacons
        // TODO: remove filter and update account holder page table to enable claiming of beacons
        .filter(
          ({ beaconStatus }) =>
            beaconStatus === "NEW" || beaconStatus === "MIGRATED"
        )
        .map((beacon) => ({
          id: beacon.id,
          createdDate: formatDateTruncated(beacon.createdDate),
          lastModifiedDate: formatDateTruncated(beacon.lastModifiedDate),
          beaconStatus: beacon.beaconStatus,
          hexId: beacon.hexId,
          ownerName: beacon.beaconStatus === "NEW" ? beacon.ownerName : null,
          mainUse: []
            .concat(beacon.registrationMarks || [], beacon.vesselNames || [])
            .filter(Boolean)
            .join(", "),
          uses:
            beacon.beaconStatus === "NEW"
              ? titleCase(beacon.useActivities)
              : null,
        }))
    );
  };
