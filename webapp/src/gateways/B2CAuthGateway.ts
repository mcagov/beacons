import {
  ClientCredentialRequest,
  ConfidentialClientApplication,
  NodeAuthOptions,
} from "@azure/msal-node";
import logger from "../logger";
import { AuthGateway } from "./interfaces/AuthGateway";

export class B2CAuthGateway implements AuthGateway {
  private auth: NodeAuthOptions;

  public constructor(
    auth = {
      clientId: process.env.AZURE_B2C_CLIENT_ID,
      authority: `https://${process.env.AZURE_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_B2C_TENANT_NAME}.onmicrosoft.com`,
      knownAuthorities: [
        `https://${process.env.AZURE_B2C_TENANT_NAME}.b2clogin.com`,
      ],
      clientSecret: process.env.AZURE_B2C_CLIENT_SECRET,
    }
  ) {
    this.auth = auth;
  }

  public async canConnectToB2C(): Promise<boolean> {
    // const accessTokenResult = await this.getAccessToken();
    const accessTokenResult = "error";

    const canConnectToB2C = !accessTokenResult
      .toLowerCase()
      .trim()
      .includes("error");
    return canConnectToB2C;
  }

  public async getAccessToken(
    cca = new ConfidentialClientApplication({ auth: this.auth })
  ): Promise<string> {
    try {
      const accessTokenRequest: ClientCredentialRequest = {
        scopes: ["default"],
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
}
