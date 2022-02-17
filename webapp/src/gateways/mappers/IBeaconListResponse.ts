import { IApiResponse } from "./IApiResponse";
import { IBeaconDataAttributes } from "./IBeaconDataAttributes";

export interface IBeaconListResponse extends IApiResponse {
  data: IBeaconDataAttributes[];
}
