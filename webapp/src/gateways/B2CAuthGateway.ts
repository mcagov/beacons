import {
  Configuration,
  PublicClientApplication,
  SilentRequest,
} from "@azure/msal-browser";
// import { NodeAuthOptions, ConfidentialClientApplication, ClientCredentialRequest } from "@azure/msal-node";
import { AuthGateway } from "./interfaces/AuthGateway";

export class B2CAuthGateway implements AuthGateway {
  private msalConfig: Configuration;
  // private msalAuthOptions: NodeAuthOptions;

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

  // public async getAccessToken(
  //   cca = new ConfidentialClientApplication({ auth: this.msalAuthOptions })
  // ): Promise<string> {
  //   try {
  //     const accessTokenRequest: ClientCredentialRequest = {
  //       scopes: ["default"],
  //     };

  //     console.log(accessTokenRequest);

  //     const authResult = await cca.acquireTokenByClientCredential(
  //       accessTokenRequest
  //     );
  //     console.log(authResult.accessToken);
  //     return authResult.accessToken;
  //   } catch (error) {
  //     throw `MSAL error: ${error}`;
  //   }
  // }
}
