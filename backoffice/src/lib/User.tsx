export type User = {
  username: string | unknown;
  displayName: string | unknown;
  roles: Role[] | unknown;
};

export type Role =
  | "DEFAULT_ACCESS"
  | "ADD_BEACON_NOTES"
  | "UPDATE_RECORDS"
  | "DATA_EXPORTER";
