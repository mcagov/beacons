import { IBeaconSearchApiResponse } from "./../mappers/IBeaconSearchApiResponse";

export interface BeaconSearchGateway {
  getBeaconsForAccountHolder(
    accountHolderId: string,
    email: string
  ): Promise<IBeaconSearchApiResponse>;
}
