import axios from "axios";
import { applicationConfig } from "config";
import { ILegacyBeacon } from "entities/ILegacyBeacon";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { ILegacyBeaconResponseMapper } from "gateways/mappers/LegacyBeaconResponseMapper";
import {
  IUpdateRecoveryEmailDTO,
  IUpdateRecoveryEmailData,
} from "./IUpdateRecoveryEmailDTO";
import { ILegacyBeaconsGateway } from "./ILegacyBeaconsGateway";

export class LegacyBeaconsGateway implements ILegacyBeaconsGateway {
  private _legacyBeaconResponseMapper;
  private _authGateway;

  public constructor(
    legacyBeaconResponseMapper: ILegacyBeaconResponseMapper,
    authGateway: IAuthGateway,
  ) {
    this._legacyBeaconResponseMapper = legacyBeaconResponseMapper;
    this._authGateway = authGateway;
  }

  public async getLegacyBeacon(beaconId: string): Promise<ILegacyBeacon> {
    try {
      const accessToken = await this._authGateway.getAccessToken();

      const response = await axios.get(
        `${applicationConfig.apiUrl}/legacy-beacon/${beaconId}`,
        {
          timeout: applicationConfig.apiTimeoutMs,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return this._legacyBeaconResponseMapper.map(response.data);
    } catch (e) {
      throw e;
    }
  }

  public async updateRecoveryEmail(
    beaconId: string,
    updatedRecoveryEmail: string,
  ): Promise<IUpdateRecoveryEmailData> {
    try {
      const accessToken = await this._authGateway.getAccessToken();

      const updateRecoveryEmailDto: IUpdateRecoveryEmailDTO = {
        data: {
          recoveryEmail: updatedRecoveryEmail,
        },
      };
      const response: IUpdateRecoveryEmailDTO = await axios.patch(
        `${applicationConfig.apiUrl}/legacy-beacon/recovery-email/${beaconId}`,
        updateRecoveryEmailDto,
        {
          timeout: applicationConfig.apiTimeoutMs,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
