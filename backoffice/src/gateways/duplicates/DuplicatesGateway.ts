import axios from "axios";
import { applicationConfig } from "config";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import {
  IDuplicatesSummaryDTO,
  IDuplicateSummary,
} from "./IDuplicatesSummaryDTO";
import { IDuplicatesGateway } from "./IDuplicatesGateway";

export class DuplicatesGateway implements IDuplicatesGateway {
  private _authGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getDuplicates(): Promise<IDuplicateSummary[]> {
    const accessToken = await this._authGateway.getAccessToken();
    const url = `${applicationConfig.apiUrl}/duplicates/`;

    const res = await axios.get<IDuplicateSummary[]>(url, {
      timeout: applicationConfig.apiTimeoutMs,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  }
}
