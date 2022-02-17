import { Beacon } from "../../entities/Beacon";
import { RegistrationResponse } from "../../lib/deprecatedRegistration/IRegistrationResponseBody";

export interface IBeaconResponseMapper {
  map: (beaconApiResponse: RegistrationResponse) => Beacon;
  mapList: (beaconApiResponse: RegistrationResponse[]) => Beacon[];
}
