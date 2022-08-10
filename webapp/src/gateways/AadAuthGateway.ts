import {
  AccountInfo,
  ClientCredentialRequest,
  ConfidentialClientApplication,
  NodeAuthOptions,
  PublicClientApplication,
} from "@azure/msal-node";
import logger from "../logger";
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
      logger.info("Access token retrieved");
      return authResult.accessToken;
    } catch (error) {
      logger.error("getAccessToken:", error);
      throw error;
    }
  }

  // what if everything'sfine with b2c but just nobody's logged in yet? not ideal to return null but that
  // tells us if b2c is inaccessible
  public async getSignedInAccounts(): Promise<AccountInfo[]> {
    try {
      const beaconsWebApp = new PublicClientApplication(this.config);
      const tokenCache = beaconsWebApp.getTokenCache();
      return tokenCache.getAllAccounts();
    } catch (error) {
      return null;
    }
  }
}
