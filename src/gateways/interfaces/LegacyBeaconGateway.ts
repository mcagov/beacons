export interface LegacyBeaconGatewayInterface {
  getLegacyBeacon: (legacyBeaconId: string) => Promise<string>;
}
