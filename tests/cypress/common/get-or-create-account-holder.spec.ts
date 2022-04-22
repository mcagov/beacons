import { makeAuthenticatedRequest } from "./make-authenticated-request.spec";
import Chainable = Cypress.Chainable;

export const getOrCreateAccountHolder = (
  authId: string,
  email: string
): Chainable => {
  cy.log(`Attempting to get AccountHolder for authId ${authId}`);
  return makeAuthenticatedRequest<{ data: { id: string } }>({
    url: `http://localhost:8080/spring-api/account-holder?authId=${authId}`,
    method: "GET",
  }).then((getAccountHolderResponse) => {
    if (getAccountHolderResponse.status === 404) {
      cy.log(
        `AccountHolder for authId ${authId} and email ${email} not found; creating...`
      );

      return makeAuthenticatedRequest<{ data: { id: string } }>({
        method: "POST",
        body: { data: { attributes: { authId, email } } },
        url: "http://localhost:8080/spring-api/account-holder",
      }).then((createAccountHolderResponse) => {
        const accountHolderId = createAccountHolderResponse.body.data.id;
        cy.log(`Successfully created AccountHolder with id ${accountHolderId}`);
        completeSignupProcess(accountHolderId).then(() => {
          return accountHolderId;
        });
      });
    } else {
      const accountHolderId = getAccountHolderResponse.body.data.id;
      return completeSignupProcess(accountHolderId).then(() => {
        return accountHolderId;
      });
    }
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
