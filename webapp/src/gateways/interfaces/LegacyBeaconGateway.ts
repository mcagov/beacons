import { LegacyBeacon } from "../../entities/LegacyBeacon";

export interface LegacyBeaconGateway {
  getById: (legacyBeaconId: string) => Promise<LegacyBeacon>;
}
