import { Registration } from "../../src/entities/Registration";
import { AadAuthGateway } from "../../src/gateways/AadAuthGateway";
import { BeaconsApiAccountHolderGateway } from "../../src/gateways/BeaconsApiAccountHolderGateway";
import { BeaconsApiBeaconGateway } from "../../src/gateways/BeaconsApiBeaconGateway";
import { AuthGateway } from "../../src/gateways/interfaces/AuthGateway";
import { IAppContainer } from "../../src/lib/IAppContainer";
import { getOrCreateAccountHolder } from "../../src/useCases/getOrCreateAccountHolder";
import { submitRegistration } from "../../src/useCases/submitRegistration";

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
  registration: Registration
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

  const beaconsApiGateway = new BeaconsApiBeaconGateway(
    Cypress.env("API_URL"),
    beaconsApiAuthGateway
  );

  const accountHolderApiGateway = new BeaconsApiAccountHolderGateway(
    Cypress.env("API_URL"),
    beaconsApiAuthGateway
  );

  const container: Partial<IAppContainer> = {
    beaconGateway: beaconsApiGateway,
    accountHolderGateway: accountHolderApiGateway,
    sendConfirmationEmail: () => null,
  };

  const sessionEndpoint = "/api/auth/session";

  cy.request(sessionEndpoint, { timeout: 10000 }).then(
    { timeout: 10000 },
    async (response) => {
      const session = response.body;

      try {
        const accountHolder = await getOrCreateAccountHolder(container)(
          session
        );

        const { beaconRegistered } = await submitRegistration(container)(
          registration,
          accountHolder.id
        );

        if (beaconRegistered) {
          cy.log("Registered a beacon with hex ID " + registration.hexId);
        } else {
          cy.log(
            "There was a problem registering beacon with hex ID " +
              registration.hexId
          );
        }
      } catch (e) {
        cy.log(
          "There was a problem registering beacon with hex ID " +
            registration.hexId +
            ", error message: " +
            e
        );
      }
    }
  );
};

export const randomUkEncodedHexId = (): string => {
  const ukEncodingCountryCode = "1D0";
  return (
    ukEncodingCountryCode +
    Math.random().toString(16).substr(2, 12).toUpperCase()
  );
};
