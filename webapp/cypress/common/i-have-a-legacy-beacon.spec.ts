import { ILegacyBeaconRequest } from "../../src/gateways/interfaces/LegacyBeaconRequest";

export const iHavePreviouslyRegisteredALegacyBeacon = async (
  legacyBeaconRequest: ILegacyBeaconRequest
): Promise<void> => {
  const url = `${Cypress.env("API_URL")}/migrate/legacy-beacon`;

  try {
    cy.request({
      method: "POST",
      auth: {
        username: "user",
        password: "password",
      },
      body: legacyBeaconRequest,
      url,
    });
    cy.log("LegacyBeacon successfully POSTed");
  } catch (e) {
    cy.log("Seeding LegacyBeacon failed with message ", e);
  }
};

export const givenIHavePreviouslyRegisteredALegacyBeacon =
  iHavePreviouslyRegisteredALegacyBeacon;
