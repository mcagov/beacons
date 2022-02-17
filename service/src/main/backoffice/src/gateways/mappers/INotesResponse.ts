import { IApiResponse } from "./IApiResponse";
import { INoteResponseData } from "./INoteResponseData";

export interface INotesResponse extends IApiResponse {
  data: INoteResponseData[];
}
