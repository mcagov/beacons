import {
  ILegacyBeacon,
  ILegacyEmergencyContact,
  ILegacyOwner,
  ILegacyUse,
} from "entities/ILegacyBeacon";
import { IApiResponse } from "./IApiResponse";

export interface ILegacyBeaconResponse extends IApiResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      beacon: ILegacyBeacon;
      uses: ILegacyUse[];
      owner: ILegacyOwner;
      secondaryOwners: ILegacyOwner[];
      emergencyContact: ILegacyEmergencyContact;
      claimStatus: "CLAIMED";
    };
  };
}
