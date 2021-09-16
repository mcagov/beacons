export interface IBeaconDataAttributes {
  type: string;
  id: string;
  attributes: {
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
