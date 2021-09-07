import { IBeaconSearchApiResponse } from "../gateways/mappers/IBeaconSearchApiResponse";

export type GetBeaconSearchByAccountHolderIdAndEmailFn = (
  accountId: string,
  email: string
) => Promise<IBeaconSearchApiResponse>;
