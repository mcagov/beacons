import { IEmergencyContact } from "../../entities/IEmergencyContact";
import { IOwner } from "../../entities/IOwner";
import { IUse } from "../../entities/IUse";
import { IAccountHolderResponse } from "./IAccountHolderResponse";

export interface IRegistrationResponse {
  id: string;
  hexId: string;
  status?: string;
  beaconType?: string;
  manufacturer?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  model?: string;
  manufacturerSerialNumber?: string;
  chkCode?: string;
  mti?: string;
  svdr?: boolean;
  csta?: string;
  mod?: boolean;
  protocol?: string;
  coding?: string;
  batteryExpiryDate?: string;
  lastServicedDate?: string;
  referenceNumber: string;
  owner?: OwnerRegistrationResponse;
  owners?: OwnersRegistrationResponse;
  accountHolder?: IAccountHolderResponse;
  uses?: UseRegistrationResponse[];
  emergencyContacts?: EmergencyContactRegistrationResponse[];
  mainUseName?: string;
}

export type OwnerRegistrationResponse = IOwner;

export type OwnersRegistrationResponse = IOwner[];

export type UseRegistrationResponse = IUse;

export type EmergencyContactRegistrationResponse = IEmergencyContact;
