export enum BeaconDeletionReasons {
  DECOMMISSIONED = "Decommissioned",
  GDPR_REQUEST = "GDPR request",
  LEGACY_UNABLE_TO_CLAIM = "Legacy unable to claim",
  QUERY_RESOLVED = "Query resolved",
  REPLACED = "Replaced",
  SOLD = "Sold",
  OTHER = "Other",
}

export const reasonsForDeletion: string[] | undefined = Object.values(
  BeaconDeletionReasons,
);
