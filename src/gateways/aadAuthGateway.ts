import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
} from "@azure/msal-node";
import { appConfig } from "../appConfig";

export interface IAuthGateway {
  getAccessToken: () => Promise<string>;
}

export class AadAuthGateway implements IAuthGateway {
  public async getAccessToken(): Promise<string> {
    try {
      const confidentialClientApplication = new ConfidentialClientApplication(
        appConfig.aadConfig
      );

      const accessTokenRequest: ClientCredentialRequest = {
        scopes: [`api://${process.env.AAD_API_ID}/.default`],
      };

      const authResult = await confidentialClientApplication.acquireTokenByClientCredential(
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
