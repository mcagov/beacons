import { IEmergencyContact } from "./emergencyContact";
import { IEntityLink } from "./entityLink";
import { IOwner } from "./owner";
import { IUse } from "./use";

export interface IBeacon {
  id: string;
  hexId: string;
  type: string;
  registeredDate: string;
  status: string;
  manufacturer: string;
  model: string;
  manufacturerSerialNumber: string;
  chkCode: string;
  protocolCode: string;
  codingMethod: string;
  batteryExpiryDate: string;
  lastServicedDate: string;
  uses: IUse[];
  owners: IOwner[];
  emergencyContacts: IEmergencyContact[];
  entityLinks: IEntityLink[];
}
