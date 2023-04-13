import axios from "axios";
import { applicationConfig } from "config";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IDuplicateSummary } from "./IDuplicatesSummaryDTO";
import { IDuplicatesGateway } from "./IDuplicatesGateway";
import { IDuplicateBeacon } from "entities/IDuplicateBeacon";
import { logToServer } from "utils/logger";

export class DuplicatesGateway implements IDuplicatesGateway {
  private _authGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getDuplicates(
    pageNumber: number,
    duplicateSummariesPerPage: number
  ): Promise<IDuplicateSummary[]> {
    const accessToken = await this._authGateway.getAccessToken();
    const url = `${applicationConfig.apiUrl}/duplicates/?pageNumber=${pageNumber}&duplicateSummariesPerPage=${duplicateSummariesPerPage}`;

    const res = await axios.get<IDuplicateSummary[]>(url, {
      timeout: applicationConfig.apiTimeoutMs,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  }

  public async getDuplicatesForHexId(
    hexId: string
  ): Promise<IDuplicateBeacon[]> {
    const accessToken = await this._authGateway.getAccessToken();
    const url = `${applicationConfig.apiUrl}/duplicates/${hexId}`;

    try {
      const res = await axios.get<IDuplicateBeacon[]>(url, {
        timeout: applicationConfig.apiTimeoutMs,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      logToServer.error(error);
      throw error;
    }
  }
}
