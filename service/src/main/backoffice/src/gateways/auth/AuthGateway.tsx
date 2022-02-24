import { IPublicClientApplication } from "@azure/msal-browser";
import { applicationConfig } from "config";
import { IAuthGateway } from "./IAuthGateway";

export class AuthGateway implements IAuthGateway {
  private publicClientApplication: IPublicClientApplication;

  constructor(publicClientApplication: IPublicClientApplication) {
    this.publicClientApplication = publicClientApplication;
  }

  public async getAccessToken(): Promise<string> {
    try {
      const account = this.publicClientApplication.getAllAccounts()[0];

      const accessTokenRequest = {
        scopes: [applicationConfig.azureADAPIScopeURI as string],
        account: account,
      };

      const response = await this.publicClientApplication.acquireTokenSilent(
        accessTokenRequest
      );

      return response.accessToken;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
