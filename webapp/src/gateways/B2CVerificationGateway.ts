import axios from "axios";
import logger from "../logger";
import { AccountPageURLs } from "../lib/urls";

export class B2CVerificationGateway {
  private readonly tenantName = "bjb";
  private readonly userFlow = process.env.AZURE_B2C_SIGNUP_FLOW;
  private readonly clientId = process.env.AZURE_B2C_CLIENT_ID;
  private readonly redirectUri =
    process.env.NEXTAUTH_URL + AccountPageURLs.signIn;
  private readonly b2CVerificationUrl = `https://${this.tenantName}.b2clogin.com/${this.tenantName}.onmicrosoft.com/${this.userFlow}/oauth2/v2.0/authorize?p=${this.userFlow}&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=openid&response_type=id_token&prompt=login`;

  public async canConnectToB2C(): Promise<boolean> {
    try {
      const b2cResponse = await axios.get(this.b2CVerificationUrl);
      return b2cResponse.status === 200;
    } catch (error) {
      logger.error("B2C connection threw an error", error);
      return false;
    }
  }
}
