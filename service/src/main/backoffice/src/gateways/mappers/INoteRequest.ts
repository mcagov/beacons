export interface INoteRequest {
  data: {
    type: "note";
    attributes: {
      beaconId: string;
      text: string;
      type: string;
    };
  };
}
