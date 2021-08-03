import { Beacon } from "../../entities/Beacon";
import { IBeaconListResponse } from "./IBeaconListResponse";

export interface IBeaconResponseMapper {
  mapList: (beaconApiResponse: IBeaconListResponse) => Beacon[];
}
