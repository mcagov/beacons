import { LegacyBeacon } from "../../entities/LegacyBeacon";

export interface LegacyBeaconGateway {
  getLegacyBeacon: (legacyBeaconId: string) => Promise<LegacyBeacon>;
}
