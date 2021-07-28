import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
} from "@azure/msal-node";
import { appConfig } from "../appConfig";

export interface AuthGateway {
  getAccessToken: (cca?: ConfidentialClientApplication) => Promise<string>;
}

export class AadAuthGateway implements AuthGateway {
  public async getAccessToken(
    cca = new ConfidentialClientApplication(appConfig.aadConfig)
  ): Promise<string> {
    try {
      const accessTokenRequest: ClientCredentialRequest = {
        scopes: [`api://${process.env.AAD_API_ID}/.default`],
      };

      const authResult = await cca.acquireTokenByClientCredential(
        accessTokenRequest
      );
      return authResult.accessToken;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
