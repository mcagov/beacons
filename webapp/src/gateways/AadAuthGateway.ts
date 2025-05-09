import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
  NodeAuthOptions,
} from "@azure/msal-node";
import logger from "../logger";
import { AuthGateway } from "./interfaces/AuthGateway";

export class AadAuthGateway implements AuthGateway {
  private config: { auth: NodeAuthOptions; apiId: string; cache: any };

  public constructor(
    config = {
      auth: {
        clientId: process.env.WEBAPP_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.AAD_TENANT_ID}`,
        clientSecret: process.env.WEBAPP_CLIENT_SECRET,
      },
      apiId: process.env.AAD_API_ID,
      cache: {
        cacheLocation: "localStorage",
      },
    },
  ) {
    this.config = config;
  }

  public async getAccessToken(
    cca = new ConfidentialClientApplication({ auth: this.config.auth }),
  ): Promise<string> {
    try {
      const accessTokenRequest: ClientCredentialRequest = {
        scopes: [`api://${this.config.apiId}/.default`],
      };

      const authResult =
        await cca.acquireTokenByClientCredential(accessTokenRequest);
      logger.info("Access token retrieved");
      return authResult.accessToken;
    } catch (error) {
      logger.error("getAccessToken:", error);
      throw error;
    }
  }
}
