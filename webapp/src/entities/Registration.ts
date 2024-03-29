import { BeaconUse } from "./BeaconUse";

export interface Registration {
  id?: string;
  registeredDate?: string;
  lastModifiedDate?: string;
  manufacturer: string;
  model: string;
  hexId: string;
  isSecondGeneration: boolean;
  referenceNumber: string;
  accountHolderId: string;

  manufacturerSerialNumber: string;
  chkCode: string;
  csta: string;
  batteryExpiryDate: string;
  batteryExpiryDateMonth: string;
  batteryExpiryDateYear: string;
  lastServicedDate: string;
  lastServicedDateMonth: string;
  lastServicedDateYear: string;

  ownerFullName: string;
  ownerEmail: string;
  ownerTelephoneNumber: string;
  ownerAlternativeTelephoneNumber: string;
  ownerAddressLine1: string;
  ownerAddressLine2: string;
  ownerAddressLine3?: string;
  ownerAddressLine4?: string;
  ownerTownOrCity: string;
  ownerCounty: string;
  ownerPostcode: string;
  ownerCountry: string;

  emergencyContact1FullName: string;
  emergencyContact1TelephoneNumber: string;
  emergencyContact1AlternativeTelephoneNumber: string;
  emergencyContact2FullName: string;
  emergencyContact2TelephoneNumber: string;
  emergencyContact2AlternativeTelephoneNumber: string;
  emergencyContact3FullName: string;
  emergencyContact3TelephoneNumber: string;
  emergencyContact3AlternativeTelephoneNumber: string;

  uses: BeaconUse[];
}
