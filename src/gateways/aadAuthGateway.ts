import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
  IConfidentialClientApplication,
} from "@azure/msal-node";

export interface IAuthGateway {
  getAccessToken: () => Promise<string>;
}

export class AadAuthGateway implements IAuthGateway {
  private readonly confidentialClientApplication: IConfidentialClientApplication;

  constructor(cca: ConfidentialClientApplication) {
    this.confidentialClientApplication = cca;
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
