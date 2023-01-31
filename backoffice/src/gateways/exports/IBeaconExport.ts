export interface IBeaconExport {
  type: "Legacy" | "New";
  name: string;
  proofOfRegistrationDate: string;
  departmentReference: string;
  referenceNumber: string;
  recordCreatedDate: string;
  lastModifiedDate: string;
  beaconStatus: string;
  hexId: string;
  manufacturer: string;
  serialNumber: number;
  manufacturerSerialNumber: string;
  beaconModel: string;
  beaconlastServiced: string;
  beaconCoding: string;
  batteryExpiryDate: string;
  codingProtocol: string;
  cstaNumber: string;
  cospasSarsatNumber: string;
  chkCode: string;
  beaconNote: string;
  notes: IBeaconExportNote[];
  uses: IBeaconExportUse[];
  owners: IBeaconExportOwner[];
  accountHolder: IBeaconExportAccountHolder;
  emergencyContacts: IBeaconExportEmergencyContact[];
}

export interface IBeaconExportNote {
  date: string;
  note: string;
}

export interface IBeaconExportOwner {
  ownerName: string;
  companyName: string;
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
  email: string;
  fax: string;
}

export interface IBeaconExportAccountHolder {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  townOrCity: string;
  postcode: string;
  county: string;
  country: string;
  telephoneNumbers: string;
  email: string;
}

export interface IBeaconExportUse {
  //Generic, TODO - split out into types.
  environment: string;
  typeOfUse: string;
  beaconLocation: string;
  beaconPosition: string;
  windfarmLocation: string;
  rigPlatformLocation: string;
  vesselName: string;
  rigName: string;
  homePort: string;
  maxPersonOnBoard: string;
  vesselCallsign: string;
  mmsiNumber: string;
  radioSystems: Record<string, string>;
  notes: string;
  fishingVesselPortIdAndNumbers: string;
  officialNumber: string;
  imoNumber: string;
  rssAndSsrNumber: string;
  hullIdNumber: string;
  coastguardCGRefNumber: string;
  aircraftType: string;
  aircraftRegistrationMark: string;
  aircraftManufacturer: string;
  twentyFourBitAddressInHex: string;
  aodSerialNumber: string;
  principalAirport: string;
  secondaryAirport: string;
  isDongle: string;
  aircraftOperatorsDesignatorAndSerialNo: string;
  descriptionOfIntendedUse: string;
  numberOfPersonsOnBoard: string;
  areaOfUse: string;
  tripInformation: string;
  areaOfOperation: string;
}
export interface IBeaconExportEmergencyContact {
  fullName: string;
  telephoneNumber: string;
  alternativeTelephoneNumber: string;
}
