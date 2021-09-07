import { IBeaconSearchApiResponse } from "../gateways/mappers/IBeaconSearchApiResponse";
import { IAppContainer } from "../lib/IAppContainer";

export type GetBeaconsForAccountHolderFn = (
  accountId: string,
  email: string
) => Promise<IBeaconSearchApiResponse[]>;

export const getBeaconsForAccountHolder =
  ({ beaconSearchGateway }: IAppContainer): GetBeaconsForAccountHolderFn =>
  async (accountId: string, email: string) => {
    const beacons = await beaconSearchGateway.getBeaconsByAccountHolderAndEmail(
      accountId,
      email,
      { column: "lastModifiedDate", direction: "desc" }
    );

    return beacons.filter((beacon) => beacon.beaconStatus === "NEW");
  };
