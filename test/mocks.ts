import { IFormCache } from "../src/lib/formCache";
import {
  Activity,
  BeaconUse,
  Environment,
  Purpose,
} from "../src/lib/registration/types";

export const getCacheMock = (): jest.Mocked<IFormCache> => {
  return {
    get: jest.fn(),
    update: jest.fn(),
    clear: jest.fn(),
    set: jest.fn(),
  };
};

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
  activity: Activity.OTHER,
  purpose: Purpose.PLEASURE,
  callSign: "callSign",
  vhfRadio: "false",
  fixedVhfRadio: "true",
  fixedVhfRadioInput: "0117",
  portableVhfRadio: "true",
  portableVhfRadioInput: "0118",
  satelliteTelephone: "true",
  satelliteTelephoneInput: "0119",
  mobileTelephone: "true",
  mobileTelephoneInput1: "01178123456",
  mobileTelephoneInput2: "01178123457",
  otherCommunication: "true",
  otherCommunicationInput: "Via email",
  maxCapacity: "22",
  vesselName: "My lucky boat",
  portLetterNumber: "12345",
  homeport: "Bristol",
  areaOfOperation: "Newport",
  beaconLocation: "In my carry bag",
  imoNumber: "123456",
  ssrNumber: "123456",
  rssNumber: "123456",
  officialNumber: "123456",
  rigPlatformLocation: "On the rig",
  aircraftManufacturer: "Boeing",
  principalAirport: "Bristol",
  secondaryAirport: "Cardiff",
  registrationMark: "Reg mark",
  hexAddress: "123456",
  cnOrMsnNumber: "123456",
  dongle: "false",
  beaconPosition: "Carry bag",
  driving: "false",
  cycling: "false",
  climbingMountaineering: "false",
  skiing: "false",
  walkingHiking: "false",
  workingRemotely: "true",
  workingRemotelyLocation: "Bristol",
  workingRemotelyPeopleCount: "10",
  windfarm: "true",
  windfarmLocation: "10",
  windfarmPeopleCount: "10",
  otherActivityText: "On my boat",
  otherActivityLocation: "Taunton",
  otherActivityPeopleCount: "10",
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
