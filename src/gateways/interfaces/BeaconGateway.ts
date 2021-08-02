import { IRegistrationRequestBody } from "../../lib/deprecatedRegistration/IRegistrationRequestBody";
import { IDeleteBeaconRequest } from "../BeaconsApiBeaconGateway";

export interface BeaconGateway {
  sendRegistration: (
    json: IRegistrationRequestBody,
    accessToken: string
  ) => Promise<boolean>;

  deleteBeacon: (
    json: IDeleteBeaconRequest,
    accessToken: string
  ) => Promise<boolean>;
}
