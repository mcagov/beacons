export interface BeaconUse {
  environment: string;
  purpose: string;
  activity: string;
  otherActivityText: string;
  otherCommunication: string;
  otherCommunicationInput: string;

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
  portLetterNumber: string;
  homeport: string;
  areaOfOperation: string;
  beaconLocation: string;
  imoNumber: string;
  ssrNumber: string;
  rssNumber: string;
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

  // Land environment
  driving: string;
  cycling: string;
  climbingMountaineering: string;
  skiing: string;
  walkingHiking: string;
  workingRemotely: string;
  workingRemotelyLocation: string;
  workingRemotelyPeopleCount: string;
  windfarm: string;
  windfarmLocation: string;
  windfarmPeopleCount: string;
  otherActivityLocation: string;
  otherActivityPeopleCount: string;

  // Generic more details on use of beacon
  moreDetails: string;
  additionalBeaconUse: string;
}
