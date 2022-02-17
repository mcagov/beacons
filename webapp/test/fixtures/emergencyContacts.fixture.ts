import { EmergencyContact } from "../../src/entities/EmergencyContact";
import { deepFreeze } from "../deepFreeze";

export const emergencyContactsFixture: EmergencyContact[] = deepFreeze([
  {
    id: "5ffd1b86-d347-49e2-b821-4550c72666c1",
    fullName: "Lady Hamilton",
    telephoneNumber: "02392 856621",
    alternativeTelephoneNumber: "02392 856622",
  },
  {
    id: "3851e8c7-6e4e-4827-ab8f-b904f845582f",
    fullName: "Neil Hamilton",
    telephoneNumber: "04392 856626",
    alternativeTelephoneNumber: "04392 856625",
  },
]);
