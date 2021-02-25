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

export enum MaritimePleasureVessel {
  MOTOR = "MOTOR",
  SAILING = "SAILING",
  ROWING = "ROWING",
  SMALL_UNPOWERED = "SMALL_UNPOWERED",
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

export interface Vessel {
  maxCapacity: string;
  vesselName: string;
  homeport: string;
  areaOfOperation: string;
  beaconLocation: string;
  moreVesselDetails: string;
  maritimePleasureVesselUse: string;
  otherPleasureVesselText: string;
}

export interface Owner {
  beaconOwnerAddressLine1: string;
  beaconOwnerAddressLine2: string;
  beaconOwnerTownOrCity: string;
}

export const formSubmissionCookieId = "submissionId";
