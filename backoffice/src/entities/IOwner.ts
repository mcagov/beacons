export interface IOwner {
  id: string;
  fullName: string;
  email: string;
  isMain: boolean;
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
}
