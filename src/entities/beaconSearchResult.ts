export interface IBeaconSearchResult {
  meta: { count: number; pageSize: number };

  data: {
    type: "beacon";
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

      uses: {
        environment: string;
        activity: string;
        moreDetails: string;
      }[];

      owner: {
        fullName: string;
        email: string;
        telephoneNumber: string;
        addressLine1: string;
        addressLine2: string;
        townOrCity: string;
        county: string;
        postcode: string;
      };

      emergencyContacts: {
        fullName: string;
        telephoneNumber: string;
        alternativeTelephoneNumber: string;
      }[];
    };
  }[];
}
