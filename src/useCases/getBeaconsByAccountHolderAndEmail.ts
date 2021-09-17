import { AccountListBeacon } from "../entities/AccountListBeacon";
import { IAppContainer } from "../lib/IAppContainer";
import { formatDateTruncated, titleCase } from "../lib/writingStyle";
import { BeaconSearchSortOptions } from "./../gateways/interfaces/BeaconSearchGateway";

export type GetBeaconsForAccountHolderFn = (
  accountId: string,
  email: string,
  sortOptions: BeaconSearchSortOptions
) => Promise<AccountListBeacon[]>;

const dummyBeacons = [
  {
    id: "c5c5640d-a5ed-4fb1-9b80-924963d13f3a",
    createdDate: "2021-09-14T14:50:28.797243Z",
    lastModifiedDate: "2021-09-14T14:50:28.797243Z",
    beaconStatus: "NEW",
    hexId: "1D0E9B07CEFFBFF",
    ownerName: "sdasd",
    ownerEmail: "sdfsdf@asdd.co.uk",
    accountHolderId: "7083f986-5525-4262-87a3-83819aa62499",
    useActivities: "CLIMBING MOUNTAINEERING, MOTOR",
    _links: { self: [Object], beaconSearchEntity: [Object] },
  },
  {
    id: "c5c5640d-a5ed-4fb1-9b80-92546456546d13f3a",
    createdDate: "2021-09-14T14:50:28.797243Z",
    lastModifiedDate: "2021-09-14T14:50:28.797243Z",
    beaconStatus: "NEW",
    hexId: "1D0E9B07CEFFFGF",
    ownerName: "sdasd",
    ownerEmail: "sdfsdf@asdd.co.uk",
    accountHolderId: "7083f986-5525-4262-87a3-838dsfsdf2499",
    useActivities: "CLIMBING MOUNTAINEERING, MOTOR",
    _links: { self: [Object], beaconSearchEntity: [Object] },
  },
  {
    id: "c5c5640d-a5ed-4fb1-9b80-924963d13f3a",
    createdDate: "2021-09-14T14:50:28.797243Z",
    lastModifiedDate: "2021-09-14T14:50:28.797243Z",
    beaconStatus: "MIGRATED",
    hexId: "1D0E9B07CEFFBFF",
    ownerName: "sdasd",
    ownerEmail: "sdfsdf@asdd.co.uk",
    accountHolderId: "7083f986-5525-4262-87a3-83fsdfdsf499",
    useActivities: "CLIMBING MOUNTAINEERING, MOTOR",
    _links: { self: [Object], beaconSearchEntity: [Object] },
  },
];

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
      dummyBeacons
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
          uses:
            beacon.beaconStatus === "NEW"
              ? titleCase(beacon.useActivities)
              : null,
        }))
    );
  };
