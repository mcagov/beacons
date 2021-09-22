import axios from "axios";
import { ILegacyBeaconRequest } from "../../src/gateways/interfaces/LegacyBeaconRequest";

export const iHavePreviouslyRegisteredALegacyBeacon = async (
  legacyBeaconRequest: ILegacyBeaconRequest
): Promise<void> => {
  const url = `${Cypress.env("API_URL")}/migrate/legacy-beacon`;

  try {
    await axios.post(url, legacyBeaconRequest, {
      auth: {
        username: "user",
        password: "password",
      },
    });
    cy.log("LegacyBeacon successfully POSTed");
  } catch (e) {
    cy.log("Seeding LegacyBeacon failed with message ", e);
    throw e;
  }
};
