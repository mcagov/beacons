import { BeaconStatuses, BeaconTypes } from "./IBeacon";

export interface ILegacyBeacon {
  pkBeaconId: number;
  statusCode: string;
  isWithdrawn: string;
  isPending: string;
  departRefId: string;
  hexId: string;
  manufacturer: string;
  beaconType: BeaconTypes;
  model: string;
  protocol: string;
  serialNumber: number;
  cospasSarsatNumber: number;
  manufacturerSerialNumber: string;
  coding: string;
  firstRegistrationDate: string;
  lastServiceDate: string;
  batteryExpiryDate: string;
  withdrawnReason: string;
  isArchived: string;
  createUserId: number;
  createdDate: string;
  updateUserId: number;
  lastModifiedDate: string;
  versioning: number;
  note: string;
  uses: ILegacyUse[];
  owner: ILegacyOwner;
  secondaryOwners: ILegacyOwner[];
  emergencyContact: ILegacyEmergencyContact;
  beaconStatus: BeaconStatuses;
  csta: string;
  mti: string;
}

export interface ILegacyUse {
  pkBeaconUsesId: number;
  fkBeaconId: number;
  vesselName: string;
  homePort: string;
  maxPersons: number;
  officialNumber: string;
  rssSsrNumber: string;
  callSign: string;
  imoNumber: string;
  mmsiNumber: number | null;
  fishingVesselPln: string;
  hullIdNumber: string;
  cg66RefNumber: string;
  aodSerialNumber: string;
  principalAirport: string;
  bit24AddressHex: string;
  aircraftRegistrationMark: string;
  areaOfUse: string;
  tripInfo: string;
  rigName: string;
  beaconPosition: string;
  position: string;
  localManagementId: string;
  beaconNsn: string;
  beaconPartNumber: string;
  notes: string;
  pennantNumber: string;
  aircraftDescription: string;
  survivalCraftType: string;
  communications: string;
  isMain: string;
  createUserId: number;
  createdDate: string;
  updateUserId: number;
  lastModifiedDate: string;
  versioning: number;
  useType: string;
  vesselType: string;
  aircraftType: string;
  landUse: string;
  note: string;
  modType: string;
  modStatus: string;
  modVariant: string;
  activationMode: string;
}

export interface ILegacyOwner {
  pkBeaconOwnerId?: number;
  fkBeaconId?: number;
  ownerName: string;
  companyName: string;
  careOf: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  country: string;
  postCode: string;
  phone1: string;
  phone2: string;
  mobile1: string;
  mobile2: string;
  fax: string;
  email: string;
  isMain: string;
  createUserId: number;
  createdDate: string;
  updateUserId: number;
  lastModifiedDate: string;
  versioning: number;
}

export interface ILegacyEmergencyContact {
  details: string;
}
