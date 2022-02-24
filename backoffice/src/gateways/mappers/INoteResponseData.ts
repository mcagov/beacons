export interface INoteResponseData {
  type: string;
  id: string;
  attributes: {
    beaconId: string;
    text: string;
    type: string;
    createdDate: string;
    userId: string;
    fullName: string;
    email: string;
  };
  relationships: Record<string, any>;
}
