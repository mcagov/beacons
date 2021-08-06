import { DraftRegistration } from "../../../src/entities/DraftRegistration";
import { AadAuthGateway } from "../../../src/gateways/AadAuthGateway";
import { BeaconsApiAccountHolderGateway } from "../../../src/gateways/BeaconsApiAccountHolderGateway";
import { BeaconsApiBeaconGateway } from "../../../src/gateways/BeaconsApiBeaconGateway";
import { AuthGateway } from "../../../src/gateways/interfaces/AuthGateway";
import { IAppContainer } from "../../../src/lib/IAppContainer";
import { getOrCreateAccountHolder } from "../../../src/useCases/getOrCreateAccountHolder";
import { submitRegistration } from "../../../src/useCases/submitRegistration";
import { singleBeaconRegistration } from "../../fixtures/singleBeaconRegistration";

/**
 * Quickly sets up test state where a single beacon is already registered.
 *
 * @remarks
 * This function programmatically submits a DraftRegistration to the Service
 * API, avoiding an expensive arrange step where Cypress goes to each page and
 * submits a web form from the browser.
 *
 * Webapp application code is re-used to establish Cypress as an OAuth 2.0
 * confidential client, allowing it to submit requests to the Service API as if
 * it were the Webapp.
 */
export const iHavePreviouslyRegisteredABeacon = async (
  draftRegistration: DraftRegistration
): Promise<void> => {
  /**
   *  A custom auth gateway is
   */
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

  const beaconsApiGateway = new BeaconsApiBeaconGateway(
    Cypress.env("API_URL"),
    beaconsApiAuthGateway
  );

  const accountHolderApiGateway = new BeaconsApiAccountHolderGateway(
    Cypress.env("API_URL"),
    beaconsApiAuthGateway
  );

  const container: Partial<IAppContainer> = {
    beaconsApiGateway,
    accountHolderApiGateway,
    sendConfirmationEmail: () => null,
  };

  const sessionEndpoint = "/api/auth/session";

  cy.request(sessionEndpoint).then(async (response) => {
    const session = response.body;

    const accountHolder = await getOrCreateAccountHolder(container)(session);

    await submitRegistration(container)(draftRegistration, accountHolder.id);
  });
};

export const iCanSeeMyExistingRegistration = (): void => {
  cy.get("main").contains(singleBeaconRegistration.hexId);
  cy.get("main").contains(singleBeaconRegistration.ownerFullName);
};
