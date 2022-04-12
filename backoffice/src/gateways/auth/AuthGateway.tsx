import { IPublicClientApplication } from "@azure/msal-browser";
import { logToServer } from "../../logger";
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
        scopes: [
          `api://${
            this.publicClientApplication.getConfiguration().auth.clientId
          }/access_as_user`,
        ],
        account: account,
      };

      const response = await this.publicClientApplication.acquireTokenSilent(
        accessTokenRequest
      );

      return response.accessToken;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }
}
