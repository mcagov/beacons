import axios from "axios";
import { applicationConfig } from "config";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { customDateStringFormat } from "utils/dateTime";
import {
  ExportSearchFormProps,
  IBeaconExportSearchResult,
} from "views/exports/BeaconExportSearch";
import { logToServer } from "../../utils/logger";
import { IBeaconExport } from "./IBeaconExport";
import { IExportsGateway } from "./IExportsGateway";
import { IDataComparison } from "views/comparison/DataComparisonView";

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

  public async getLabelForBeacon(beaconId: string): Promise<Blob> {
    const accessToken = await this._authGateway.getAccessToken();
    return await axios
      .get(`${applicationConfig.apiUrl}/export/label/${beaconId}`, {
        timeout: applicationConfig.apiTimeoutMs,
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data);
  }

  public async getLabelsForBeacons(beaconIds: string[]): Promise<Blob> {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios
      .post<Blob>(`${applicationConfig.apiUrl}/export/labels`, beaconIds, {
        timeout: applicationConfig.apiTimeoutMs,
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data);
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

  public async searchExportData(
    searchForm: ExportSearchFormProps
  ): Promise<IBeaconExportSearchResult> {
    const accessToken = await this._authGateway.getAccessToken();

    let url = `${
      applicationConfig.apiUrl
    }/beacon-search/search/full-export-search?name=${encodeURIComponent(
      searchForm.name || ""
    )}`;

    if (searchForm.registrationFrom) {
      url += `&registrationFrom=${encodeURIComponent(
        customDateStringFormat(
          searchForm.registrationFrom,
          "yyyy-MM-DDTHH:mm:ss.SSSZ"
        )
      )}`;
    }
    if (searchForm.registrationTo) {
      url += `&registrationTo=${encodeURIComponent(
        customDateStringFormat(
          searchForm.registrationTo,
          "yyyy-MM-DDTHH:mm:ss.SSSZ"
        )
      )}`;
    }
    if (searchForm.lastModifiedFrom) {
      url += `&lastModifiedFrom=${encodeURIComponent(
        customDateStringFormat(
          searchForm.lastModifiedFrom,
          "yyyy-MM-DDTHH:mm:ss.SSSZ"
        )
      )}`;
    }
    if (searchForm.lastModifiedTo) {
      url += `&lastModifiedTo=${encodeURIComponent(
        customDateStringFormat(
          searchForm.lastModifiedTo,
          "yyyy-MM-DDTHH:mm:ss.SSSZ"
        )
      )}`;
    }

    try {
      const exportResponse = await axios.get<IBeaconExportSearchResult>(url, {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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
      return exportResponse.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }

  public async getDataComparison(): Promise<IDataComparison> {
    const accessToken = await this._authGateway.getAccessToken();
    const url = `${applicationConfig.apiUrl}/comparison/missing`;

    try {
      const exportResponse = await axios.get<IDataComparison>(url, {
        timeout: 100000,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return exportResponse.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }
}
