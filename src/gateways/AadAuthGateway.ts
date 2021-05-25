/* eslint-disable no-console */

import {
  ClientCredentialRequest,
  IConfidentialClientApplication,
} from "@azure/msal-node";
import { IAuthGateway } from "./IAuthGateway";

const aadConfig = {
  auth: {
    clientId: process.env.AAD_CLIENT_ID,
    authority: "https://login.microsoftonline.com/ 'TENANT' ",
    clientSecret: process.env.AAD_CLIENT_SECRET,
  },
};

export class AadAuthGateway implements IAuthGateway {
  private confidentialClientApplication: IConfidentialClientApplication;

  constructor(confidentialClientApplication: IConfidentialClientApplication) {
    this.confidentialClientApplication = confidentialClientApplication;
  }

  public async getAccessToken(): Promise<string> {
    try {
      const accessTokenRequest: ClientCredentialRequest = {
        scopes: ["https://graph.microsoft.com/.default"],
      };

      const authResult = await this.confidentialClientApplication.acquireTokenByClientCredential(
        accessTokenRequest
      );
      return authResult.accessToken;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
