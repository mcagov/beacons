export enum BeaconDeletionReasons {
  SOLD = "Sold",
  DESTROYED = "Destroyed",
  REPLACED = "Replaced",
  INCORRECTLY_REGISTERED = "Incorrectly registered",
  DUPLICATE = "Duplicate",
  OTHER = "Other",
}

export const reasonsForDeletion: string[] | undefined = Object.values(
  BeaconDeletionReasons
);
