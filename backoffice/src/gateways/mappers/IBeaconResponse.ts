import { IApiResponse } from "./IApiResponse";

export interface IBeaconResponse extends IApiResponse {
  data: {
    type: string;
    id: string;
    attributes: IBeaconResponseAttributes;
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
  };
}

export interface IBeaconResponseAttributes {
  id: string;
  hexId: string;
  status?: string;
  beaconType?: string;
  manufacturer?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  model?: string;
  manufacturerSerialNumber?: string;
  chkCode?: string;
  mti?: string;
  svdr?: boolean;
  csta?: string;
  mod?: boolean;
  protocol?: string;
  coding?: string;
  batteryExpiryDate?: string;
  lastServicedDate?: string;
  referenceNumber: string;
  mainUseName: string;
}
