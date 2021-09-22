export interface LegacyBeaconGateway {
  getLegacyBeacon: (legacyBeaconId: string) => Promise<string>;
}
