import { IBeacon } from "entities/IBeacon";
import { INote } from "entities/INote";

export interface ICertificate {
  proofOfRegistrationDate: Date;
  contactNumber: string;
  beacon: IBeacon;
  notes: INote[];
}
