import { INote, NoteType } from "../entities/INote";
import { deepFreeze } from "../utils";

export const notesFixture = deepFreeze<INote[]>([
  {
    id: "bc6d7716-f8cd-469e-a701-10cac3775eb5",
    beaconId: "8b0c56-77d3-42da-8d0a-48f987eeac4c",
    text: "That's a great beacon right there",
    type: NoteType.GENERAL,
    createdDate: "2021-09-24 11:09:55.914918 +00:00",
    userId: "344848b9-8a5d-4818-a57d-1815528d543e",
    fullName: "Beacon McBeaconFace",
    email: "mcbeaconface@beacons.com",
  },
  {
    id: "0f2b0eec-9e10-4a98-bd28-57cf2aab85e0",
    beaconId: "8b0c56-77d3-42da-8d0a-48f987eeac4c",
    text: "That's not a great beacon right here",
    type: NoteType.INCIDENT,
    createdDate: "2021-09-24 11:09:55.914918 +00:00",
    userId: "344848b9-8a5d-4818-a57d-1815528d543e",
    fullName: "Beacon McBeaconFace",
    email: "mcbeaconface@beacons.com",
  },
]);
