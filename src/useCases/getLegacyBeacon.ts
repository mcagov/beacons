import { IAppContainer } from "../lib/IAppContainer";

export const getLegacyBeacon =
  ({ legacyBeaconGateway }: IAppContainer) =>
  async (legacyBeaconId: string): Promise<any> =>
    await legacyBeaconGateway.getLegacyBeacon(legacyBeaconId);
