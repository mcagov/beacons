/* eslint-disable no-console */

import {
  ClientCredentialRequest,
  IConfidentialClientApplication,
} from "@azure/msal-node";
import { IAuthGateway } from "./IAuthGateway";

const aadConfig = {
  azureAdClientId: process.env.AAD_CLIENT_ID,
  azureAdTenantId: process.env.AAD_TENANT_ID,
  azureAdApiScopeURI: process.env.AAD_API_SCOPE_URI,
};

export class AadAuthGateway implements IAuthGateway {
  private confidentialClientApplication: IConfidentialClientApplication;

  constructor(confidentialClientApplication: IConfidentialClientApplication) {
    this.confidentialClientApplication = confidentialClientApplication;
  }

  public async getAccessToken(): Promise<string> {
    try {
      const accessTokenRequest: ClientCredentialRequest = {
        scopes: [aadConfig.azureAdApiScopeURI],
      };

      const authResult = await this.confidentialClientApplication.acquireTokenByClientCredential(
        accessTokenRequest
      );
      return authResult.accessToken;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
