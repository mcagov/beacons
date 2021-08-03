import { BeaconUse } from "../src/entities/BeaconUse";
import {
  Activity,
  Environment,
  Purpose,
} from "../src/lib/deprecatedRegistration/types";

// TODO: Update `any` type once domain/form objects are defined
export const getMockBeacon = (): any => ({
  model: "Trousers",
  hexId: "1D0",
  manufacturer: "ASOS",
  referenceNumber: "ADBEFD",
  manufacturerSerialNumber: "1234",
  chkCode: "check",
  batteryExpiryDate: new Date().toISOString(),
  lastServicedDate: new Date().toISOString(),
});

export const getMockUse = (): BeaconUse => ({
  environment: Environment.MARITIME,
  activity: Activity.SAILING,
  purpose: Purpose.PLEASURE,
  callSign: "callSign",
  vhfRadio: "true",
  fixedVhfRadio: "true",
  fixedVhfRadioInput: "0117",
  portableVhfRadio: "true",
  portableVhfRadioInput: "0118",
  satelliteTelephone: "true",
  satelliteTelephoneInput: "01161627",
  mobileTelephone: "true",
  mobileTelephoneInput1: "01178123456",
  mobileTelephoneInput2: "01178123457",
  otherCommunication: "true",
  otherCommunicationInput: "Via email",
  maxCapacity: "22",
  vesselName: "My lucky boat",
  portLetterNumber: "PLY22",
  homeport: "Bristol",
  areaOfOperation: "Newport",
  beaconLocation: "In my carry bag",
  imoNumber: "8814275",
  ssrNumber: "029 20448820",
  rssNumber: "123AKJHSDH",
  officialNumber: "BY1293",
  rigPlatformLocation: "On the rig",
  aircraftManufacturer: "Boeing",
  principalAirport: "Bristol",
  secondaryAirport: "Cardiff",
  registrationMark: "Reg mark",
  hexAddress: "3238ABCDE",
  cnOrMsnNumber: "NM819291",
  dongle: "true",
  beaconPosition: "Carry bag",
  driving: "true",
  cycling: "true",
  climbingMountaineering: "true",
  skiing: "true",
  walkingHiking: "true",
  workingRemotely: "true",
  workingRemotelyLocation: "Bristol",
  workingRemotelyPeopleCount: "10",
  windfarm: "true",
  windfarmLocation: "Scotland",
  windfarmPeopleCount: "19",
  otherActivityText: "On my boat",
  otherActivityLocation: "Taunton",
  otherActivityPeopleCount: "35",
  moreDetails: "Blue boat, tracked in SafeTrx",
  additionalBeaconUse: "false",
});

// TODO: Update `any` type once domain/form objects are defined
export const getMockAccountHolder = (): any => ({
  fullName: "Mrs A. Holder",
  email: "aholder@mca.gov.uk",
  telephoneNumber: "0118792136545",
  alternativeTelephoneNumber: "0118792136545",
  addressLine1: "8",
  addressLine2: "Points East",
  townOrCity: "Yate",
  county: "Bristol",
  postcode: "BS37 6YG",
});

// TODO: Update `any` type once domain/form objects are defined
export const getMockOwner = (): any => ({
  fullName: "Mrs Martha",
  email: "martha@mca.gov.uk",
  telephoneNumber: "0117892136545",
  alternativeTelephoneNumber: "0117892136545",
  addressLine1: "6",
  addressLine2: "Points West",
  townOrCity: "Bristol",
  county: "Bristol",
  postcode: "BS17YG",
});

// TODO: Update `any` type once domain/form objects are defined
export const getMockEmergencyContact = (): any => ({
  fullName: "Mrs Beacon",
  telephoneNumber: "0117823456",
  alternativeTelephoneNumber: "0117823457",
});
