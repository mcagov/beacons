import axios, { AxiosResponse } from "axios";
import { AccountPageURLs } from "../lib/urls";
import logger from "../logger";

export class B2CVerificationGateway {
  private readonly tenantName = process.env.AZURE_B2C_TENANT_NAME;
  private readonly userFlow = process.env.AZURE_B2C_SIGNUP_FLOW;
  private readonly clientId = process.env.AZURE_B2C_CLIENT_ID;
  private readonly redirectUri =
    process.env.NEXTAUTH_URL + AccountPageURLs.signIn;
  private readonly b2CVerificationUrl: string;

  constructor() {
    this.b2CVerificationUrl = `https://${this.tenantName}.b2clogin.com/${this.tenantName}.onmicrosoft.com/${this.userFlow}/oauth2/v2.0/authorize?p=${this.userFlow}&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=openid&response_type=id_token&prompt=login`;
  }

  public async canConnectToB2C(): Promise<boolean> {
    let b2cResponse: AxiosResponse<any>;

    try {
      b2cResponse = await axios.get(this.b2CVerificationUrl);
      const isSuccessStatus = b2cResponse.status === 200;
      return isSuccessStatus;
    } catch (error) {
      logger.error(`B2C connection attempt threw an error: ${error}`);
      return false;
    }
  }
}
