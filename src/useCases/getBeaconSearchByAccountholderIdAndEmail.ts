import { IBeaconSearchApiResponse } from "../gateways/mappers/IBeaconSearchApiResponse";
import { IAppContainer } from "./../lib/IAppContainer";

export type GetBeaconSearchByAccountHolderIdAndEmailFn = (
  accountId: string,
  email: string
) => Promise<IBeaconSearchApiResponse>;

export const getBeaconSearchByAcountHolderIdAndEmail =
  ({
    beaconSearchGateway,
  }: IAppContainer): GetBeaconSearchByAccountHolderIdAndEmailFn =>
  async (accountId: string, email: string) => {
    return null;
  };
