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

  public canConnectToB2C(): boolean {
    const currentlySignedInAccount = this.getCurrentlySignedInAccount();

    console.log(currentlySignedInAccount);
    const canConnectToB2C = !currentlySignedInAccount
      .toLowerCase()
      .trim()
      .includes("error");
    return canConnectToB2C;
  }

  private getCurrentlySignedInAccount(): string {
    const msalInstance = new PublicClientApplication(this.msalConfig);

    try {
      const signedInAccount = msalInstance.getActiveAccount();
      console.log(`signed in account is ${signedInAccount}`);
      return signedInAccount.username;
    } catch (error) {
      return `MSAL error: ${error}`;
    }
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
      return `MSAL error: ${error}`;
    }
  }
}
