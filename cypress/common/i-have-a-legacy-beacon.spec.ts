import axios from "axios";
import { AadAuthGateway } from "../../src/gateways/AadAuthGateway";
import { BeaconsApiAccountHolderGateway } from "../../src/gateways/BeaconsApiAccountHolderGateway";
import { AuthGateway } from "../../src/gateways/interfaces/AuthGateway";
import { ILegacyBeaconRequest } from "../../src/gateways/interfaces/LegacyBeaconRequest";
import { LegacyBeaconGateway } from "../../src/gateways/LegacyBeaconGateway";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { getOrCreateAccountHolder } from "../../src/useCases/getOrCreateAccountHolder";
import { givenIHaveWaitedForBeaconsApi } from "./selectors-and-assertions.spec";

const createLegacyBeacon = async (
  apiUrl: string,
  migratedLegacyBeaconEndpoint: string,
  legacyBeaconRequest: ILegacyBeaconRequest
) => {
  const url = `${apiUrl}/${migratedLegacyBeaconEndpoint}`;
  const response = await axios.post(url, legacyBeaconRequest, {
    auth: {
      username: "user",
      password: "password",
    },
  });
  cy.log("legacy beacon successfully posted");
};

export const iHavePreviouslyRegisteredALegacyBeacon = async (
  legacyBeaconRequest: ILegacyBeaconRequest
): Promise<void> => {
  const beaconsApiAuthGateway: AuthGateway = new AadAuthGateway({
    auth: {
      clientId: Cypress.env("WEBAPP_CLIENT_ID"),
      authority: `https://login.microsoftonline.com/${Cypress.env(
        "AAD_TENANT_ID"
      )}`,
      clientSecret: Cypress.env("WEBAPP_CLIENT_SECRET"),
    },
    apiId: Cypress.env("AAD_API_ID"),
  });

  const accountHolderApiGateway = new BeaconsApiAccountHolderGateway(
    Cypress.env("API_URL"),
    beaconsApiAuthGateway
  );

  const legacyBeaconGateway = new LegacyBeaconGateway(Cypress.env("API_URL"));

  const container: Partial<IAppContainer> = {
    legacyBeaconGateway: legacyBeaconGateway,
    accountHolderGateway: accountHolderApiGateway,
  };

  const sessionEndpoint = "/api/auth/session";

  cy.request(sessionEndpoint).then(async (response) => {
    cy.log("logged in");
    const session = response.body;
    const migrateLegacyBeaconEndpoint = "migrate/legacy-beacon";

    const accountHolder = await getOrCreateAccountHolder(container)(session);

    givenIHaveWaitedForBeaconsApi(10000);

    await createLegacyBeacon(
      Cypress.env("API_URL"),
      migrateLegacyBeaconEndpoint,
      legacyBeaconRequest
    );
  });
};
