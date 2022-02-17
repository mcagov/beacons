import axios, { AxiosResponse } from "axios";
import { applicationConfig } from "config";
import { IUse } from "entities/IUse";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IBeaconResponseMapper } from "gateways/mappers/BeaconResponseMapper";
import { IUsesGateway } from "./IUsesGateway";

export class UsesGateway implements IUsesGateway {
  private _usesResponseMapper;
  private _authGateway;

  public constructor(
    usesResponseMapper: IBeaconResponseMapper,
    authGateway: IAuthGateway
  ) {
    this._usesResponseMapper = usesResponseMapper;
    this._authGateway = authGateway;
  }

  public async getUses(beaconId: string): Promise<IUse[]> {
    try {
      const response = await this._makeGetRequest(`/registrations/${beaconId}`);

      return this._usesResponseMapper.map(response.data).uses;
    } catch (e) {
      throw Error(e);
    }
  }

  private async _makeGetRequest(path: string): Promise<AxiosResponse> {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios.get(`${applicationConfig.apiUrl}${path}`, {
      timeout: applicationConfig.apiTimeoutMs,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
