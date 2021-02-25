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

export enum VesselCommunication {
  FIXED_VHF_RADIO = "FIXED_VHF_RADIO",
  PORTABLE_VHF_RADIO = "PORTABLE_VHF_RADIO",
  SATELLITE_TELEPHONE = "SATELLITE_TELEPHONE",
  MOBILE_TELEPHONE = "MOBILE_TELEPHONE",
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

export interface VesselCommunications {
  callSign: string;
  vhfRadio: string;
  fixedVhfRadio: string;
  fixedVhfRadioInput: string;
  portableVhfRadio: string;
  portableVhfRadioInput: string;
  satelliteTelephone: string;
  satelliteTelephoneInput: string;
  mobileTelephone: string;
  mobileTelephoneInput1: string;
  mobileTelephoneInput2: string;
}

export const formSubmissionCookieId = "submissionId";
