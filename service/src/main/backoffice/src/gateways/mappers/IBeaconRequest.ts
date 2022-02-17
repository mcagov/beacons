export interface IBeaconRequest {
  data: {
    type: string;
    id: string;
    attributes: {
      hexId?: string;
      status?: string;
      beaconType?: string;
      manufacturer?: string;
      createdDate?: string;
      model?: string;
      manufacturerSerialNumber?: string;
      chkCode?: string;
      protocol?: string;
      coding?: string;
      batteryExpiryDate?: string;
      lastServicedDate?: string;
    };
  };
}
