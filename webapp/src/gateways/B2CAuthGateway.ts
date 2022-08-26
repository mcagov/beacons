import {
  Configuration,
  PublicClientApplication,
  SilentRequest,
} from "@azure/msal-browser";
import { AuthGateway } from "./interfaces/AuthGateway";

export class B2CAuthGateway implements AuthGateway {
  private msalConfig: Configuration;

  public constructor(
    msalConfig = {
      auth: {
        clientId: process.env.AZURE_B2C_CLIENT_ID,
        authority: `https://${process.env.AZURE_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_B2C_TENANT_NAME}.onmicrosoft.com`,
        knownAuthorities: [
          `https://${process.env.AZURE_B2C_TENANT_NAME}.b2clogin.com`,
        ],
        clientSecret: process.env.AZURE_B2C_CLIENT_SECRET,
      },
    }
  ) {
    this.msalConfig = msalConfig;
  }

  public async canConnectToB2C(): Promise<boolean> {
    const accessTokenResult = await this.getAccessToken();
    // const accessTokenResult = "error";
    console.log(accessTokenResult);
    const canConnectToB2C = !accessTokenResult
      .toLowerCase()
      .trim()
      .includes("error");
    return canConnectToB2C;
  }

  public async getAccessToken(): Promise<string> {
    const msalInstance = new PublicClientApplication(this.msalConfig);
    const silentTokenRequest: SilentRequest = {
      scopes: ["default"],
    };

    try {
      const authenticationResult = await msalInstance.acquireTokenSilent(
        silentTokenRequest
      );
      console.log(authenticationResult.accessToken);
      return authenticationResult.accessToken;
    } catch (error) {
      return "MSAL error";
    }
  }
}
