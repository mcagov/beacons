export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
}

export enum BeaconIntent {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  CHANGE_OWNERSHIP = "CHANGE_OWNERSHIP",
  WITHDRAW = "WITHDRAW",
  OTHER = "OTHER",
}

export interface Beacon {
  manufacturer: string;
  model: string;
  hexId: string;
  manufacturerSerialNumber: string;
  batteryExpiryDate: string;
  lastServicedDate: string;
}

export const formSubmissionCookieId = "submissionId";
