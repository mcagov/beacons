import { IBeaconSearchApiResponseBody } from "../mappers/IBeaconSearchApiResponse";

export type BeaconSearchSortColumn =
  | "createdDate"
  | "lastModifiedDate"
  | "beaconStatus"
  | "hexId"
  | "ownerName"
  | "useActivities";

export type BeaconSearchSortDirection = "asc" | "desc";

export interface BeaconSearchSortOptions {
  column: BeaconSearchSortColumn;
  direction: BeaconSearchSortDirection;
}

export interface BeaconSearchGateway {
  getBeaconsByAccountHolderAndEmail(
    accountHolderId: string,
    email: string,
    sortOptions: BeaconSearchSortOptions
  ): Promise<IBeaconSearchApiResponseBody[]>;
}
