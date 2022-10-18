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
    return this.retrieveExportDataList(
      `${applicationConfig.apiUrl}/export/certificates/data`,
      beaconIds
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
    return this.retrieveExportDataList(
      `${applicationConfig.apiUrl}/export/letters/data`,
      beaconIds
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
    return this.retrieveExportDataList(
      `${applicationConfig.apiUrl}/export/beacons/data`,
      beaconIds
    );
  }
  public async getExportDataForAllBeacons(): Promise<IBeaconExport[]> {
    return this.retrieveExportDataList(
      `${applicationConfig.apiUrl}/export/beacons/all`,
      []
    );
  }
  public async searchExportData(searchForm: any): Promise<IBeaconExport[]> {
    const accessToken = await this._authGateway.getAccessToken();

    try {
      const exportResponse = await axios.post<IBeaconExport[]>(
        `${applicationConfig.apiUrl}/export/beacons/search`,
        searchForm,
        {
          timeout: applicationConfig.apiTimeoutMs,
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.dir(exportResponse);
      return exportResponse.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
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

  private async retrieveExportDataList(
    url: string,
    ids: string[]
  ): Promise<IBeaconExport[]> {
    const accessToken = await this._authGateway.getAccessToken();

    try {
      const exportResponse = await axios.post<IBeaconExport[]>(url, ids, {
        timeout: applicationConfig.apiTimeoutMs,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.dir(exportResponse);
      return exportResponse.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }
}
