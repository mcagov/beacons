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
    let certificateData = {};

    try {
      const certificateResponse = await axios.get(
        `${applicationConfig.apiUrl}/export/certificate/data/${beaconId}`,
        {
          timeout: applicationConfig.apiTimeoutMs,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (certificateResponse.data) {
        certificateData = certificateResponse.data;
        console.log(certificateData);
      }
    } catch (error) {
      logToServer.error(error);
    }

    return certificateData;
  }
}