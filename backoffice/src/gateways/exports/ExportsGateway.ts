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

  public async getLabelForBeacon(beaconId: string): Promise<Blob> {
    const accessToken = await this._authGateway.getAccessToken();

    return fetch(`${applicationConfig.apiUrl}/export/label/${beaconId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((response) => response.blob());
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

  public async getBackupExportFile(): Promise<any> {
    const accessToken = await this._authGateway.getAccessToken();

    // return fetch(`${applicationConfig.apiUrl}/export/xlsx/backup`, {
    //   headers: { Authorization: `Bearer ${accessToken}` },
    // }).then((response) => response.blob());

    // try {
    //   const res = await axios.get(`${applicationConfig.apiUrl}/export/xlsx/backup`, {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });

    //   console.log(res);
    //   return res.data.blob;
    // } catch (error) {
    //   logToServer.error(error);
    //   throw error;
    // }

    // const res = await axios.get(`${applicationConfig.apiUrl}/note?beaconId=044157cc-f6e8-4ea8-b7bd-5cd58f537cac`, {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });

    const res = await axios.get(
      `${applicationConfig.apiUrl}/export/xlsx/backup`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return res.data;
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
