export interface IAccountHolderResponse {
  id: string;
  attributes: {
    fullName: string;
    email: string;
    telephoneNumber: string;
    alternativeTelephoneNumber?: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3?: string;
    addressLine4?: string;
    townOrCity?: string;
    county?: string;
    postcode?: string;
    country: string;
    createdDate?: string;
    lastModifiedDate?: string;
  };
}
