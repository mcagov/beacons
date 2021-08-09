import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
  NodeAuthOptions,
} from "@azure/msal-node";
import { AuthGateway } from "./interfaces/AuthGateway";

export class AadAuthGateway implements AuthGateway {
  private config: { auth: NodeAuthOptions; apiId: string };

  public constructor(
    config = {
      auth: {
        clientId: process.env.WEBAPP_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AAD_TENANT_ID}`,
        clientSecret: process.env.WEBAPP_CLIENT_SECRET,
      },
      apiId: process.env.AAD_API_ID,
    }
  ) {
    this.config = config;
  }

  public async getAccessToken(
    cca = new ConfidentialClientApplication({ auth: this.config.auth })
  ): Promise<string> {
    try {
      const accessTokenRequest: ClientCredentialRequest = {
        scopes: [`api://${this.config.apiId}/.default`],
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
