import { IBeacon } from "../entities/beacon";
import { IAppContainer } from "../lib/appContainer";

export type GetAccountBeaconsFn = (accountId: string) => Promise<IBeacon[]>;

export const getAccountBeacons =
  ({
    getAccessToken,
    accountHolderApiGateway,
  }: IAppContainer): GetAccountBeaconsFn =>
  async (accountId: string) => {
    const accessToken = await getAccessToken();
    const accountHolderDetails =
      await accountHolderApiGateway.getAccountBeacons(accountId, accessToken);
    return accountHolderDetails;
  };
