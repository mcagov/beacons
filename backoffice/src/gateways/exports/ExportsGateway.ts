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
  public async getCertificateDataForBeacons(
    beaconIds: string[]
  ): Promise<IBeaconExport[]> {
    var beaconId = beaconIds.toString();
    return this.getExportDataList(
      `${applicationConfig.apiUrl}/export/certificates/data/${beaconId}`
    );
  }

  public async getLetterDataForBeacon(
    beaconId: string
  ): Promise<IBeaconExport> {
    return this.getExportData(
      `${applicationConfig.apiUrl}/export/letter/data/${beaconId}`
    );
  }
  public async getLetterDataForBeacons(
    beaconIds: string[]
  ): Promise<IBeaconExport[]> {
    var beaconId = beaconIds.toString();
    return this.getExportDataList(
      `${applicationConfig.apiUrl}/export/letters/data/${beaconId}`
    );
  }

  public async getExportDataForBeacon(
    beaconId: string
  ): Promise<IBeaconExport> {
    return this.getExportData(
      `${applicationConfig.apiUrl}/export/beacon/data/${beaconId}`
    );
  }
  public async getExportDataForBeacons(
    beaconIds: string[]
  ): Promise<IBeaconExport[]> {
    var beaconId = beaconIds.toString();
    return this.getExportDataList(
      `${applicationConfig.apiUrl}/export/beacons/data/${beaconId}`
    );
  }
  public async getExportDataForAllBeacons(): Promise<IBeaconExport[]> {
    return this.getExportDataList(
      `${applicationConfig.apiUrl}/export/beacons/data`
    );
  }

  private async getExportData(url: string): Promise<IBeaconExport> {
    const accessToken = await this._authGateway.getAccessToken();

    try {
      const exportResponse = await axios.get<IBeaconExport>(url, {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.dir(exportResponse);
      return exportResponse.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }

  private async getExportDataList(url: string): Promise<IBeaconExport[]> {
    const accessToken = await this._authGateway.getAccessToken();

    try {
      const exportResponse = await axios.get<IBeaconExport[]>(url, {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.dir(exportResponse);
      return exportResponse.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }
}
