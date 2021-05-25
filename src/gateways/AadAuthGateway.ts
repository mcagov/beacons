/* eslint-disable no-console */

import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
  IConfidentialClientApplication,
} from "@azure/msal-node";
import { IAuthGateway } from "./IAuthGateway";

export class AadAuthGateway implements IAuthGateway {
  private readonly confidentialClientApplication: IConfidentialClientApplication;
  private readonly aadConfig;

  constructor() {
    this.aadConfig = {
      auth: {
        clientId: process.env.AAD_CLIENT_ID,
        authority: "https://login.microsoftonline.com/ 'TENANT' ",
        clientSecret: process.env.AAD_CLIENT_SECRET,
      },
    };
    this.confidentialClientApplication = new ConfidentialClientApplication(
      this.aadConfig
    );
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
