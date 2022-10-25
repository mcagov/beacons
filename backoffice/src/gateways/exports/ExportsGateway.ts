import axios from "axios";
import { applicationConfig } from "config";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { logToServer } from "../../utils/logger";
import { IBeaconExport } from "./IBeaconExport";
import { IExportsGateway } from "./IExportsGateway";

export class ExportsGateway implements IExportsGateway {
  private _authGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getCertificateDataForBeacon(
    beaconId: string
  ): Promise<IBeaconExport> {
    return this.getExportData(
      `${applicationConfig.apiUrl}/export/certificate/data/${beaconId}`
    );
  }

  public async getLetterDataForBeacon(
    beaconId: string
  ): Promise<IBeaconExport> {
    return this.getExportData(
      `${applicationConfig.apiUrl}/export/letter/data/${beaconId}`
    );
  }

  public async getExportDataForBeacon(
    beaconId: string
  ): Promise<IBeaconExport> {
    return this.getExportData(
      `${applicationConfig.apiUrl}/export/beacon/data/${beaconId}`
    );
  }

  private async getExportData(url: string): Promise<IBeaconExport> {
    const accessToken = await this._authGateway.getAccessToken();

    try {
      const exportResponse = await axios.get<IBeaconExport>(url, {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return exportResponse.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }
}
