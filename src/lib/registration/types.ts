export interface IRegistration {
  manufacturer: string;
  model: string;
  hexId: string;
  reference: string;

  manufacturerSerialNumber: string;
  chkCode: string;
  batteryExpiryDate: string;
  batteryExpiryDateMonth: string;
  batteryExpiryDateYear: string;
  lastServicedDate: string;
  lastServicedDateMonth: string;
  lastServicedDateYear: string;

  ownerFullName: string;
  ownerEmail: string;
  ownerTelephoneNumber: string;
  ownerAlternativeTelephoneNumber: string;
  ownerAddressLine1: string;
  ownerAddressLine2: string;
  ownerTownOrCity: string;
  ownerCounty: string;
  ownerPostcode: string;

  emergencyContact1FullName: string;
  emergencyContact1TelephoneNumber: string;
  emergencyContact1AlternativeTelephoneNumber: string;
  emergencyContact2FullName: string;
  emergencyContact2TelephoneNumber: string;
  emergencyContact2AlternativeTelephoneNumber: string;
  emergencyContact3FullName: string;
  emergencyContact3TelephoneNumber: string;
  emergencyContact3AlternativeTelephoneNumber: string;

  additionalBeaconUse: string;
  uses: BeaconUse[];
}

export interface BeaconUse {
  environment: string;
  environmentOtherInput: string;
  purpose: string;
  activity: string;
  otherActivityText: string;

  // Vessel comms
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

  maxCapacity: string;
  vesselName: string;
  vesselUse: string;
  otherVesselUseText: string;
  portLetterNumber: string;
  homeport: string;
  areaOfOperation: string;
  beaconLocation: string;
  imoNumber: string;
  ssrNumber: string;
  officialNumber: string;
  rigPlatformLocation: string;

  // Aircraft info
  aircraftManufacturer: string;
  principalAirport: string;
  secondaryAirport: string;
  registrationMark: string;
  hexAddress: string;
  cnOrMsnNumber: string;
  dongle: string;
  beaconPosition: string;

  // Generic more details on use of beacon
  moreDetails: string;
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

export enum Activity {
  MOTOR = "MOTOR",
  SAILING = "SAILING",
  ROWING = "ROWING",
  SMALL_UNPOWERED = "SMALL_UNPOWERED",
  OTHER = "OTHER",

  FISHING_VESSEL = "FISHING_VESSEL",
  MERCHANT_VESSEL = "MERCHANT_VESSEL",
  COMMERCIAL_SAILING_VESSEL = "COMMERCIAL_SAILING_VESSEL",
  COMMERCIAL_MOTOR_PLEASURE_VESSEL = "COMMERCIAL_MOTOR_PLEASURE_VESSEL",
  FLOATING_PLATFORM = "FLOATING_PLATFORM",
  OFFSHORE_WINDFARM = "OFFSHORE_WINDFARM",
  OFFSHORE_RIG_PLATFORM = "OFFSHORE_RIG_PLATFORM",
}

export enum Communication {
  VHF_RADIO = "VHF_RADIO",
  FIXED_VHF_RADIO = "FIXED_VHF_RADIO",
  PORTABLE_VHF_RADIO = "PORTABLE_VHF_RADIO",
  SATELLITE_TELEPHONE = "SATELLITE_TELEPHONE",
  MOBILE_TELEPHONE = "MOBILE_TELEPHONE",
  OTHER = "OTHER",
}
