import { Beacon } from "../../entities/Beacon";
import { IBeaconListResponse } from "./IBeaconListResponse";
import { IBeaconResponse } from "./IBeaconResponse";

export interface IBeaconResponseMapper {
  map: (beaconApiResponse: IBeaconResponse) => Beacon;
  mapList: (beaconApiResponse: IBeaconListResponse) => Beacon[];
}
