import { makeAuthenticatedGETRequest } from "./make-authenticated-GET-request.spec";
import { makeAuthenticatedPOSTRequest } from "./make-authenticated-POST-request.spec";

/**
 * Quickly sets up test state where a single beacon is already registered.
 *
 * @remarks
 * This function programmatically submits a DraftRegistration to the Service
 * API, avoiding an expensive arrange step where Cypress goes to each page and
 * submits a web form from the browser.
 */
export const iHavePreviouslyRegisteredABeacon = async (
  registration: any
): Promise<void> => {
  cy.log("Getting details of the logged-in user...");
  cy.request("/api/auth/session", { timeout: 10000 }).then(
    { timeout: 10000 },
    async (session) => {
      const { authId, email } = session.body.user;

      let accountHolderId;
      cy.log(`Attempting to get AccountHolder for authId ${authId}`);
      makeAuthenticatedGETRequest<any>(
        `http://localhost:8080/spring-api/account-holder?authId=${authId}`
      ).then((getAccountHolderResponse) => {
        if (getAccountHolderResponse.status === 404) {
          cy.log(
            `AccountHolder for authId ${authId} and email ${email} not found; creating...`
          );
          makeAuthenticatedPOSTRequest<any>(
            { data: { attributes: { authId, email } } },
            "http://localhost:8080/spring-api/account-holder"
          ).then((createAccountHolderResponse) => {
            cy.log(createAccountHolderResponse.body);
            accountHolderId = createAccountHolderResponse.body.data.id;
            cy.log(
              `Successfully created AccountHolder with id ${accountHolderId}`
            );
          });
        }

        accountHolderId = getAccountHolderResponse.body.data.id;

        cy.log(
          `Seeding a registration for AccountHolder with id ${accountHolderId}...`
        );
        makeAuthenticatedPOSTRequest(
          { ...registration, accountHolderId },
          "http://localhost:8080/spring-api/registrations/register"
        );
      });
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
