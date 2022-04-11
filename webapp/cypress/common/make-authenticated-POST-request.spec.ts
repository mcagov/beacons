/**
 * Get an access token from Azure AD, then use it to POST body to URL
 *
 * @param body What to POST
 * @param url Where to POST it
 */
import RequestBody = Cypress.RequestBody;

export const makeAuthenticatedPOSTRequest = async (
  body: RequestBody,
  url: string
): Promise<void> => {
  const tenant = Cypress.env("AAD_TENANT_ID");
  const authUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const clientId = Cypress.env("WEBAPP_CLIENT_ID");
  const clientSecret = Cypress.env("WEBAPP_CLIENT_SECRET");
  const scope = `api://${Cypress.env("AAD_API_ID")}/.default`;
  const grantType = "client_credentials";

  cy.request({
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
  }).then(
    (response: {
      body: {
        access_token: string;
        token_type: string;
        expires_in: number;
      };
    }) => {
      cy.request({
        method: "POST",
        auth: {
          bearer: response.body.access_token,
        },
        url,
        body,
      });
    }
  );
};
