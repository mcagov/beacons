import axios from "axios";
import { applicationConfig } from "../../config";
import { IAuthGateway } from "../auth/IAuthGateway";

export class ExportsGateway {
  private _authGateway: IAuthGateway;

  public constructor(authGateway: IAuthGateway) {
    this._authGateway = authGateway;
  }

  public async getPdfLabel(beaconId: string) {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios.get(
      `${applicationConfig.apiUrl}$/exports/label?beaconId=${beaconId}`,
      {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  }
}

interface IPdfLabel {}
