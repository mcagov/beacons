import { IEmergencyContact } from "entities/IEmergencyContact";
import { IOwner } from "entities/IOwner";
import { IUse } from "entities/IUse";
import { INoteResponseData } from "gateways/mappers/INoteResponseData";
import { IRegistrationResponse } from "gateways/mappers/IRegistrationResponse";

// to-do: comsider extending IRegistration or summat
export interface ICertificate {
  proofOfRegistrationDate: Date;
  mcaContactNumber: string;
  beacon: IRegistrationResponse;
  owner: IOwner;
  uses: IUse[];
  emergencyContacts: IEmergencyContact[];
  notes: INoteResponseData[];
}
