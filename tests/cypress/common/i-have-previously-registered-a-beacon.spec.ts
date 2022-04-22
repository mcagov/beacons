import { getOrCreateAccountHolder } from "./get-or-create-account-holder.spec";
import { makeAuthenticatedRequest } from "./make-authenticated-request.spec";

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
  cy.setCookie("next-auth.session-token", Cypress.env("SESSION_TOKEN"), {
    log: false,
  });

  cy.log("Getting details of the logged-in user...");
  cy.request("/api/auth/session", { timeout: 10000 }).then(
    { timeout: 10000 },
    async (session) => {
      const { authId, email } = session.body.user;

      getOrCreateAccountHolder(authId, email).then((accountHolderId) => {
        cy.log(
          `Seeding a registration for AccountHolder with id ${accountHolderId}...`
        );
        cy.log(JSON.stringify({ ...registration, accountHolderId }));
        makeAuthenticatedRequest({
          method: "POST",
          url: "http://localhost:8080/spring-api/registrations/register",
          body: { ...registration, accountHolderId },
        });
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
