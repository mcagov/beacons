export type User = {
  username: string | null;
  displayName: string | null;
  roles: Role[];
};

export type Role =
  | "DEFAULT_ACCESS"
  | "ADD_BEACON_NOTES"
  | "UPDATE_RECORDS"
  | "DATA_EXPORTER";
