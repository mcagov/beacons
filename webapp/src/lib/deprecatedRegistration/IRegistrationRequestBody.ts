export interface IBeaconRequestBody {
  manufacturer: string;
  model: string;
  hexId: string;
  referenceNumber: string;
  manufacturerSerialNumber: string;
  chkCode: string;
  csta: string;
  batteryExpiryDate: string;
  lastServicedDate: string;
  owner: IOwnerRequestBody;
  emergencyContacts: IEmergencyContactRequestBody[];
  uses: IUseRequestBody[];
}

export interface IOwnerRequestBody {
  fullName: string;
  email: string;
  telephoneNumber: string;
  alternativeTelephoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  townOrCity: string;
  county: string;
  postcode: string;
  country: string;
}

export interface IEmergencyContactRequestBody {
  fullName: string;
  telephoneNumber: string;
  alternativeTelephoneNumber: string;
}

export interface IUseRequestBody {
  environment: string;
  purpose: string;
  activity: string;
  otherActivity: string;
  callSign: string;
  vhfRadio: boolean;
  fixedVhfRadio: boolean;
  fixedVhfRadioValue: string;
  portableVhfRadio: boolean;
  portableVhfRadioValue: string;
  satelliteTelephone: boolean;
  satelliteTelephoneValue: string;
  mobileTelephone: boolean;
  mobileTelephone1: string;
  mobileTelephone2: string;
  otherCommunication: boolean;
  otherCommunicationValue: string;
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
  aircraftManufacturer: string;
  principalAirport: string;
  secondaryAirport: string;
  registrationMark: string;
  hexAddress: string;
  cnOrMsnNumber: string;
  dongle: boolean;
  beaconPosition: string;
  workingRemotelyLocation: string;
  workingRemotelyPeopleCount: string;
  windfarmLocation: string;
  windfarmPeopleCount: string;
  otherActivityLocation: string;
  otherActivityPeopleCount: string;
  moreDetails: string;
  mainUse: boolean;
  maxCapacity?: string;
}
