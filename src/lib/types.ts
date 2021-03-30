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

export enum VesselCommunication {
  VHF_RADIO = "VHF_RADIO",
  FIXED_VHF_RADIO = "FIXED_VHF_RADIO",
  PORTABLE_VHF_RADIO = "PORTABLE_VHF_RADIO",
  SATELLITE_TELEPHONE = "SATELLITE_TELEPHONE",
  MOBILE_TELEPHONE = "MOBILE_TELEPHONE",
  OTHER = "OTHER",
}

export enum Environment {
  MARITIME = "MARITIME",
  AVIATION = "AVIATION",
  LAND = "LAND",
  OTHER = "OTHER",
}

export enum Purpose {
  PLEASURE = "PLEASURE",
  COMMERCIAL = "COMMERCIAL",
}

export const formSubmissionCookieId = "submissionId";
export const acceptRejectCookieId = "acceptRejectId";
