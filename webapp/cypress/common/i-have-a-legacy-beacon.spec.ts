import { ILegacyBeaconRequest } from "../../src/gateways/interfaces/LegacyBeaconRequest";
import { makeAuthenticatedPOSTRequest } from "./make-authenticated-POST-request";

export const iHavePreviouslyRegisteredALegacyBeacon = async (
  legacyBeaconRequest: ILegacyBeaconRequest
): Promise<void> => {
  const apiUrl = `${Cypress.env("API_URL")}/migrate/legacy-beacon`;

  await makeAuthenticatedPOSTRequest(legacyBeaconRequest, apiUrl);
};

export const givenIHavePreviouslyRegisteredALegacyBeacon =
  iHavePreviouslyRegisteredALegacyBeacon;
