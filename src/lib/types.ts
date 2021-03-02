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
  VHF_RADIO = "VHF_RADIO",
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
  beaconCHKCode: string;
  beaconBatteryExpiryDateMonth: string;
  beaconBatteryExpiryDateYear: string;
  lastServicedDateMonth: string;
  lastServicedDateYear: string;
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
  beaconOwnerFullName: string;
  beaconOwnerEmail?: string;
  beaconOwnerTelephoneNumber?: string;
  beaconOwnerAlternativeTelephoneNumber?: string;
  beaconOwnerAddressLine1: string;
  beaconOwnerAddressLine2: string;
  beaconOwnerTownOrCity: string;
  beaconOwnerCounty?: string;
  beaconOwnerPostcode: string;
}

export interface VesselCommunications {
  callSign: string;
  vhfRadio: VesselCommunication;
  fixedVhfRadio: string;
  fixedVhfRadioInput: string;
  portableVhfRadio: VesselCommunication;
  portableVhfRadioInput: string;
  satelliteTelephone: VesselCommunication;
  satelliteTelephoneInput: string;
  mobileTelephone: VesselCommunication;
  mobileTelephoneInput1: string;
  mobileTelephoneInput2: string;
}

export interface EmergencyContacts {
  emergencyContact1FullName: string;
  emergencyContact1TelephoneNumber: string;
  emergencyContact1AlternativeTelephoneNumber: string;
  emergencyContact2FullName: string;
  emergencyContact2TelephoneNumber: string;
  emergencyContact2AlternativeTelephoneNumber: string;
  emergencyContact3FullName: string;
  emergencyContact3TelephoneNumber: string;
  emergencyContact3AlternativeTelephoneNumber: string;
}

export const formSubmissionCookieId = "submissionId";
