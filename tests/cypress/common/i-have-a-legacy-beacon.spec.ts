import { makeAuthenticatedRequest } from "./make-authenticated-request.spec";

export const iHavePreviouslyRegisteredALegacyBeacon = (
  legacyBeaconRequest
): void => {
  const apiUrl = `${Cypress.env("API_URL")}/migrate/legacy-beacon`;

  makeAuthenticatedRequest({
    method: "POST",
    url: apiUrl,
    body: legacyBeaconRequest,
  });
};

export const givenIHavePreviouslyRegisteredALegacyBeacon =
  iHavePreviouslyRegisteredALegacyBeacon;
