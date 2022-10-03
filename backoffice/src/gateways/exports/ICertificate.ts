export interface ICertificate {
  type: "Legacy" | "New";
  proofOfRegistrationDate: string;
  departmentReference: string;
  recordCreatedDate: string;
  lastModifiedDate: string;
  beaconStatus: string;
  hexId: string;
  manufacturer: string;
  serialNumber: string;
  manufacturerSerialNumber: string;
  beaconModel: string;
  beaconlastServiced: string;
  beaconCoding: string;
  batteryExpiryDate: string;
  codingProtocol: string;
  cstaNumber: string;
  beaconNote: string;
  notes: ICertificateNote[];
  uses: ICertificateUse[];
  owners: ICertificateOwner[];
  emergencyContacts: ICertificateEmergencyContact[];
}

export interface ICertificateNote {
  date: string;
  note: string;
}

export interface ICertificateOwner {
  ownerName: string;
  companyAgent: string;
  careOf: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  townOrCity: string;
  postcode: string;
  county: string;
  country: string;
  telephoneNumbers: string;
  mobiles: string;
  email: string;
}

export interface ICertificateUse {
  //Generic, TODO - split out into types.
  environment: string;
  vesselName: string;
  homePort: string;
  vessel: string;
  maxPersonOnBoard: string;
  vesselCallsign: string;
  mmsiNumber: string;
  radioSystem: string;
  notes: string;
  fishingVesselPortIdAndNumbers: string;
  officialNumber: string;
  imoNumber: string;
  rssAndSsrNumber: string;
  hullIdNumber: string;
  coastguardCGRefNumber: string;
  aircraftType: string;
  aircraftRegistrationMark: string;
  TwentyFourBitAddressInHex: string;
  principalAirport: string;
  aircraftOperatorsDesignatorAndSerialNo: string;
  descriptionOfIntendedUse: string;
  numberOfPersonsOnBoard: string;
  areaOfUse: string;
  tripInformation: string;
}

export interface ICertificateEmergencyContact {
  fullName: string;
  telephoneNumber: string;
  alternativeTelephoneNumber: string;
}
