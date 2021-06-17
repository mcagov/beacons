export interface IAccountHolderBeaconsResponseBody {
  data: [
    {
      type: string;
      id: string;
      attributes: {
        hexId: string;
        status: string;
        manufacturer: string;
        createdDate: string;
        model: string;
        manufacturerSerialNumber: string;
        chkCode: string;
        batteryExpiryDate: string;
        lastServicedDate: string;
      };
    }
  ];
}

export interface IAccountBeacon {
  id: string;
  hexId: string;
  status: string;
  manufacturer: string;
  createdDate: string;
  model: string;
  manufacturerSerialNumber: string;
  chkCode: string;
  batteryExpiryDate: string;
  lastServicedDate: string;
}
