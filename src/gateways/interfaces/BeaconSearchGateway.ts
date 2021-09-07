import { IBeaconSearchApiResponse } from "./../mappers/IBeaconSearchApiResponse";

export type BeaconSearchSortColumn =
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
  ): Promise<IBeaconSearchApiResponse[]>;
}
