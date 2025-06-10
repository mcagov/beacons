export type IBeaconSearchApiResponse = IBeaconSearchApiResponseBody[];

export interface IBeaconSearchApiResponseBody {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  beaconStatus: string;
  hexId: string;
  ownerName: string;
  ownerEmail: string;
  accountHolderId: string;
  useActivities: string;
  registrationMarks: string[];
  vesselNames: string[];
  mainUseName: string;
}
