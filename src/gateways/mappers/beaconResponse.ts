import { IApiResponse } from "./apiResponse";

export interface IBeaconResponse extends IApiResponse {
  data: IBeaconDataAttributes[];
}

export interface IBeaconDataAttributes {
  type: string;
  id: string;
  attributes: {
    hexId: string;
    status?: string;
    type?: string;
    manufacturer?: string;
    createdDate?: string;
    model?: string;
    manufacturerSerialNumber?: string;
    chkCode?: string;
    protocolCode?: string;
    codingMethod?: string;
    batteryExpiryDate?: string;
    lastServicedDate?: string;
  };
  links: { verb: string; path: string }[];
  relationships: {
    uses: {
      data: { type: string; id: string }[];
    };
    owner: {
      data: { type: string; id: string }[];
    };
    emergencyContacts: {
      data: { type: string; id: string }[];
    };
  };
}
