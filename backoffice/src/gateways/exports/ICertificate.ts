import { IBeacon } from "entities/IBeacon";
import { IEmergencyContact } from "entities/IEmergencyContact";
import { INote } from "entities/INote";
import { IOwner } from "entities/IOwner";
import { IUse } from "entities/IUse";

export interface ICertificate {
  proofOfRegistrationDate: Date;
  mcaContactNumber: string;
  beacon: IBeacon;
  owner: IOwner;
  uses: IUse[];
  emergencyContacts: IEmergencyContact[];
  notes: INote[];
}
