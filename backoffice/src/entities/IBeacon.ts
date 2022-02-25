import { IEmergencyContact } from "./IEmergencyContact";
import { IOwner } from "./IOwner";
import { IUse } from "./IUse";

export interface IBeacon {
  id: string;
  hexId: string;
  beaconType: string;
  registeredDate: string;
  lastModifiedDate: string;
  status: string;
  manufacturer: string;
  model: string;
  manufacturerSerialNumber: string;
  chkCode: string;
  protocol: string;
  coding: string;
  batteryExpiryDate: string;
  lastServicedDate: string;
  mti: string;
  referenceNumber: string;
  svdr: string;
  csta: string;
  uses: IUse[];
  owners: IOwner[];
  emergencyContacts: IEmergencyContact[];
}

export enum BeaconStatuses {
  New = "NEW",
  Deleted = "DELETED",
  Migrated = "MIGRATED",
  Claimed = "DELETED (CLAIMED)",
  Rejected = "DELETED (REJECTED)",
}

export enum BeaconTypes {
  Elt = "ELT",
  Elt_Auto_Portable = "ELT (Auto Portable)",
  Elt_Auto = "ELT (Auto)",
  Elt_Auto_PLB = "ELT (Auto) / PLB",
  Elt_Automatic_Deployable = "ELT (Automatic Deployable)",
  Elt_Automatic_Fixed = "ELT (Automatic Fixed)",
  Elt_Man = "ELT (Man)",
  Elt_Man_Survival = "ELT (Man) - Survival",
  Elt_S = "ELT (S)",
  Elt_Auto_Elt_Portable = "ELT (Auto) / ELT (Portable)",
  Elt_Auto_Elt_Portable_Elt_Survival_PLB = "ELT (Auto) / ELT (Portable) / ELT (Survival) / PLB",
  Elt_Automatic_Fixed_And_Elt_Automatic_Portable = "ELT (Automatic Fixed) and ELT (Automatic Portable)",
  Elt_Man_PLB = "ELT (Man) / PLB",
  Elt_S_PLB = "ELT (S) / PLB",
  Epirb = "EPIRB",
  Epirb_Ff_Svdr = "EPIRB FF (S-VDR)",
  Epirb_Ff_Vdr = "EPIRB FF (VDR)",
  Ff_Non_Ff_Epirb = "FF / Non FF EPIRB",
  Ff_Epirb = "FF EPIRB",
  Non_Ff_Epirb = "Non FF EPIRB",
  Non_Ff_Epirb_Elt_Man_PLB = "Non FF EPIRB / ELT (Man) / PLB",
  Plb = "PLB",
  Plb_Non_Ff_Epirb = "PLB / Non FF EPIRB",
  Ssas = "SSAS",
}
