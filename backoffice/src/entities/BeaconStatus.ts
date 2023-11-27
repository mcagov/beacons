/**
 * The set of valid statuses a Beacon or LegacyBeacon should have
 */
export type BeaconStatus =
  | "NEW"
  | "CHANGE"
  | "MIGRATED"
  | "CLAIMED"
  | "DELETED";
