import axios from "axios";
import { applicationConfig } from "config";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IDuplicatesSummaryDTO } from "./IDuplicatesSummaryDTO";
import { IDuplicatesGateway } from "./IDuplicatesGateway";

export class DuplicatesGateway implements IDuplicatesGateway {
  private _authGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getDuplicates(): //     stuff
  Promise<IDuplicatesSummaryDTO> {
    const accessToken = await this._authGateway.getAccessToken();
    const url = `${applicationConfig.apiUrl}/duplicates/`;

    return await axios
      .get(url, {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => response.data);
  }
}
