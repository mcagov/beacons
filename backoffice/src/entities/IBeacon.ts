import { IEmergencyContact } from "./IEmergencyContact";
import { IOwner } from "./IOwner";
import { IUse } from "./IUse";
import { IAccountHolder } from "./IAccountHolder";

export interface IBeacon {
  id: string;
  hexId: string;
  status: string;
  model: string;
  manufacturer: string;
  manufacturerSerialNumber: string;
  chkCode: string;
  beaconType: string;
  protocol: string;
  coding: string;
  csta: string;
  mti: string;
  svdr: string;
  batteryExpiryDate: string;
  lastServicedDate: string;
  registeredDate: string;
  lastModifiedDate: string;
  referenceNumber: string;
  uses: IUse[];
  owners: IOwner[];
  accountHolder: IAccountHolder | null;
  emergencyContacts: IEmergencyContact[];
  mainUseName: string;
}

export enum BeaconStatuses {
  New = "NEW",
  Deleted = "DELETED",
  Migrated = "MIGRATED",
  Claimed = "DELETED (CLAIMED)",
  Rejected = "DELETED (REJECTED)",
}
