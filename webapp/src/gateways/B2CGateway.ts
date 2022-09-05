import axios from "axios";
import logger from "../logger";

export class B2CGateway {
  private readonly tenantName = process.env.AZURE_B2C_TENANT_NAME;
  private readonly loginFlow = process.env.AZURE_B2C_LOGIN_FLOW;
  private readonly clientId = process.env.AZURE_B2C_CLIENT_ID;
  private readonly loginUrl = `https://${this.tenantName}.b2clogin.com/${this.tenantName}.onmicrosoft.com/${this.loginFlow}/oauth2/v2.0/authorize?client_id=${this.clientId}`;

  public readonly redirectUrl = "/unavailable";

  public async canConnectToB2C(): Promise<boolean> {
    try {
      const b2cResponse = await axios.get(this.loginUrl);
      return b2cResponse.status === 200;
    } catch (error) {
      logger.error("B2C connection threw an error", error);
      return false;
    }
  }
}
