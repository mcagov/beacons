import { IFormCache } from "../src/lib/formCache";
import { Activity, Environment } from "../src/lib/registration/types";

export const getCacheMock = (): jest.Mocked<IFormCache> => {
  return { get: jest.fn(), update: jest.fn(), clear: jest.fn() };
};

// TODO: Update `any` type once domain/form objects are defined
export const getMockRegistration = (): any => ({
  beacons: [
    {
      ...getMockBeacon(),
      uses: [getMockUse()],
      owner: getMockOwner(),
      emergencyContacts: [getMockEmergencyContact()],
    },
  ],
});

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

// TODO: Update `any` type once domain/form objects are defined
export const getMockUse = (): any => ({
  environment: Environment.MARITIME,
  activity: Activity.OTHER,
  otherActivity: "On my boat",
  callSign: "callSign",
  vhfRadio: false,
  fixedVhfRadio: false,
  fixedVhfRadioValue: "0117",
  portableVhfRadio: false,
  portableVhfRadioValue: "0118",
  satelliteTelephone: false,
  satelliteTelephoneValue: "0119",
  mobileTelephone: false,
  mobileTelephone1: "01178123456",
  mobileTelephone2: "01178123457",
  otherCommunication: false,
  otherCommunicationValue: "Via email",
  maxCapacity: 22,
  vesselName: "My lucky boat",
  portLetterNumber: "12345",
  homeport: "Bristol",
  areaOfOperation: "Newport",
  beaconLocation: "In my carry bag",
  imoNumber: "123456",
  ssrNumber: "123456",
  officialNumber: "123456",
  rigPlatformLocation: "On the rig",
  mainUse: true,
  aircraftManufacturer: "Boeing",
  principalAirport: "Bristol",
  secondaryAirport: "Cardiff",
  registrationMark: "Reg mark",
  hexAddress: "123456",
  cnOrMsnNumber: "123456",
  dongle: false,
  beaconPosition: "Carry bag",
  workingRemotelyLocation: "Bristol",
  workingRemotelyPeopleCount: "10",
  windfarmLocation: "10",
  windfarmPeopleCount: "10",
  otherActivityLocation: "Taunton",
  otherActivityPeopleCount: "10",
  moreDetails: "Blue boat, tracked in SafeTrx",
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
