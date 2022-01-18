import {
  IEmergencyContactRequestBody,
  IOwnerRequestBody,
  IUseRequestBody,
} from "./IRegistrationRequestBody";

export type RegistrationResponse = BeaconResponse & {
  owner: BeaconOwnerResponse;
  uses: BeaconUseResponse[];
  emergencyContacts: EmergencyContactResponse[];
};

export interface BeaconResponse {
  id: string;
  hexId: string;
  referenceNumber: string;
  accountHolderId: string;
  status?: string;
  type?: string;
  manufacturer?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  model?: string;
  manufacturerSerialNumber?: string;
  chkCode?: string;
  csta?: string;
  protocolCode?: string;
  codingMethod?: string;
  batteryExpiryDate?: string;
  lastServicedDate?: string;
}

export interface BeaconUseResponse extends Partial<IUseRequestBody> {
  id: string;
}

export interface BeaconOwnerResponse extends Partial<IOwnerRequestBody> {
  id: string;
}

export interface EmergencyContactResponse
  extends Partial<IEmergencyContactRequestBody> {
  id: string;
}
