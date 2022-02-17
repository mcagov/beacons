export interface IBeaconSearchApiResponse {
  _embedded: {
    beaconSearch: IBeaconSearchApiResponseBody[];
  };
}

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
}
