import { makeAuthenticatedPOSTRequest } from "./make-authenticated-POST-request.spec";

export const iHavePreviouslyRegisteredALegacyBeacon = (
  legacyBeaconRequest
): void => {
  const apiUrl = `${Cypress.env("API_URL")}/migrate/legacy-beacon`;

  makeAuthenticatedPOSTRequest(legacyBeaconRequest, apiUrl);
};

export const givenIHavePreviouslyRegisteredALegacyBeacon =
  iHavePreviouslyRegisteredALegacyBeacon;
