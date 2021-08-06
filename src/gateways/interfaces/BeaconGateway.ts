import { DraftRegistration } from "../../entities/DraftRegistration";
import { IDeleteBeaconRequest } from "../BeaconsApiBeaconGateway";

export interface BeaconGateway {
  sendRegistration: (draftRegistration: DraftRegistration) => Promise<boolean>;

  deleteBeacon: (json: IDeleteBeaconRequest) => Promise<boolean>;
}
