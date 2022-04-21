import { makeAuthenticatedRequest } from "./make-authenticated-request.spec";
import Chainable = Cypress.Chainable;

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

const getOrCreateAccountHolder = (authId: string, email: string): Chainable => {
  let accountHolderId;

  cy.log(`Attempting to get AccountHolder for authId ${authId}`);
  return makeAuthenticatedRequest<{ data: { id: string } }>({
    url: `http://localhost:8080/spring-api/account-holder?authId=${authId}`,
    method: "GET",
  }).then((getAccountHolderResponse) => {
    if (getAccountHolderResponse.status === 404) {
      cy.log(
        `AccountHolder for authId ${authId} and email ${email} not found; creating...`
      );

      makeAuthenticatedRequest<{ data: { id: string } }>({
        method: "POST",
        body: { data: { attributes: { authId, email } } },
        url: "http://localhost:8080/spring-api/account-holder",
      }).then((createAccountHolderResponse) => {
        accountHolderId = createAccountHolderResponse.body.data.id;
        cy.log(`Successfully created AccountHolder with id ${accountHolderId}`);
      });
    } else {
      accountHolderId = getAccountHolderResponse.body.data.id;
    }

    return completeSignupProcess(accountHolderId).then(() => {
      return accountHolderId;
    });
  });
};

const completeSignupProcess = (accountHolderId: string): Chainable => {
  return makeAuthenticatedRequest({
    method: "PATCH",
    url: `http://localhost:8080/spring-api/account-holder/${accountHolderId}`,
    body: {
      data: {
        id: accountHolderId,
        attributes: {
          fullName: "Mrs Beacon",
          telephoneNumber: "+447713812659",
          addressLine1: "100 Beacons Road",
          townOrCity: "Beacons",
          county: "Beaconshire",
          postcode: "BS8 9DB",
          country: "United Kingdom",
        },
      },
    },
  });
};

export const randomUkEncodedHexId = (): string => {
  const ukEncodingCountryCode = "1D0";
  return (
    ukEncodingCountryCode +
    Math.random().toString(16).substr(2, 12).toUpperCase()
  );
};
