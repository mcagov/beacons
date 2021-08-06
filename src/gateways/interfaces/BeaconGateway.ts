import { DraftRegistration } from "../../entities/DraftRegistration";
import { IDeleteBeaconRequest } from "../BeaconsApiBeaconGateway";

export interface BeaconGateway {
  sendRegistration: (
    draftRegistration: DraftRegistration,
    accessToken: string
  ) => Promise<boolean>;

  deleteBeacon: (
    json: IDeleteBeaconRequest,
    accessToken: string
  ) => Promise<boolean>;
}
