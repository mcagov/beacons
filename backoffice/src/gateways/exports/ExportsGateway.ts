import axios from "axios";
import { applicationConfig } from "config";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { logToServer } from "../../utils/logger";
import { ICertificate } from "./ICertificate";
import { IExportsGateway } from "./IExportsGateway";

export class ExportsGateway implements IExportsGateway {
  private _authGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getCertificateDataForBeacon(
    beaconId: string
  ): Promise<ICertificate> {
    const accessToken = await this._authGateway.getAccessToken();

    try {
      const certificateResponse = await axios.get<ICertificate>(
        `${applicationConfig.apiUrl}/export/certificate/data/${beaconId}`,
        {
          timeout: applicationConfig.apiTimeoutMs,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const certificateData = certificateResponse.data;
      certificateData.type = "Migrated";
      return certificateData;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }
}
