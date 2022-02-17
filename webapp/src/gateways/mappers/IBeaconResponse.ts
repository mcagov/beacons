import { IApiResponse } from "./IApiResponse";
import { IBeaconDataAttributes } from "./IBeaconDataAttributes";

export interface IBeaconResponse extends IApiResponse {
  data: IBeaconDataAttributes;
}
