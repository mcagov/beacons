import { IApiResponse } from "./IApiResponse";
import { INoteResponseData } from "./INoteResponseData";

export interface INoteResponse extends IApiResponse {
  data: INoteResponseData;
}
