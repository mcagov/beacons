import Response = Cypress.Response;
import Chainable = Cypress.Chainable;

/**
 * Get an access token from Azure AD, then use it to make a GET request to URL
 *
 * @param url The URL to GET
 */
export function makeAuthenticatedGETRequest<T>(
  url: string
): Chainable<Response<T>> {
  const tenant = Cypress.env("AAD_TENANT_ID");
  const authUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const clientId = Cypress.env("WEBAPP_CLIENT_ID");
  const clientSecret = Cypress.env("WEBAPP_CLIENT_SECRET");
  const scope = `api://${Cypress.env("AAD_API_ID")}/.default`;
  const grantType = "client_credentials";

  // Retrieve an auth token from Azure AD
  return cy
    .request({
      method: "POST",
      form: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: {
        client_id: clientId,
        scope: scope,
        client_secret: clientSecret,
        grant_type: grantType,
      },
      url: `${authUrl}`,
    })
    .then(
      // Make GET request to URL using the retrieved auth token
      (response: {
        body: {
          access_token: string;
          token_type: string;
          expires_in: number;
        };
      }) => {
        cy.request({
          failOnStatusCode: false,
          method: "GET",
          auth: {
            bearer: response.body.access_token,
          },
          url,
        });
      }
    );
}
