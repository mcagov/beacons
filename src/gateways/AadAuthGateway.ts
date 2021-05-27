import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
  Configuration,
  IConfidentialClientApplication,
} from "@azure/msal-node";
import { IAuthGateway } from "./IAuthGateway";

export class AadAuthGateway implements IAuthGateway {
  private readonly confidentialClientApplication: IConfidentialClientApplication;
  private readonly aadConfig: Configuration = {
    auth: {
      clientId: process.env.AAD_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${process.env.AAD_TENANT_ID}`,
      clientSecret: process.env.AAD_CLIENT_SECRET,
    },
  };

  constructor(cca?: ConfidentialClientApplication) {
    this.confidentialClientApplication = cca
      ? cca
      : new ConfidentialClientApplication(this.aadConfig);
  }

  public async getAccessToken(): Promise<string> {
    try {
      const accessTokenRequest: ClientCredentialRequest = {
        scopes: [`api://${process.env.AAD_API_ID}/.default`],
      };

      const authResult = await this.confidentialClientApplication.acquireTokenByClientCredential(
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
