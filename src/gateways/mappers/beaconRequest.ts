export interface IBeaconRequest {
  data: {
    type: string;
    id: string;
    attributes: {
      hexId?: string;
      status?: string;
      type?: string;
      manufacturer?: string;
      createdDate?: string;
      model?: string;
      manufacturerSerialNumber?: string;
      chkCode?: string;
      protocolCode?: string;
      batteryExpiryDate?: string;
      lastServicedDate?: string;
    };
  };
}
