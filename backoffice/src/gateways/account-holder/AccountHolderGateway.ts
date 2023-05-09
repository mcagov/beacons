import axios, { AxiosResponse } from "axios";
import { applicationConfig } from "config";
import { IBeacon } from "entities/IBeacon";
import { logToServer } from "../../utils/logger";
import { IAccountHolder } from "../../entities/IAccountHolder";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IAccountHolderGateway } from "./IAccountHolderGateway";
import { IBeaconResponseMapper } from "gateways/mappers/BeaconResponseMapper";
import {
  IAccountHolderSearchResult,
  IAccountHolderSearchResultData,
} from "../../entities/IAccountHolderSearchResult";

export class AccountHolderGateway implements IAccountHolderGateway {
  private _authGateway;
  private _beaconResponseMapper;

  public constructor(
    beaconResponseMapper: IBeaconResponseMapper,
    authGateway: IAuthGateway
  ) {
    this._beaconResponseMapper = beaconResponseMapper;
    this._authGateway = authGateway;
  }

  public async getAccountHolder(
    accountHolderId: string
  ): Promise<IAccountHolder> {
    try {
      const response = await this._makeGetRequest(
        `/account-holder/${accountHolderId}`
      );

      return this._beaconResponseMapper.mapAccountHolder(response.data.data);
    } catch (e) {
      throw e;
    }
  }

  public async getBeaconsForAccountHolderId(
    accountHolderId: string
  ): Promise<IBeacon[]> {
    try {
      const response = await this._makeGetRequest(
        `/account-holder/${accountHolderId}/beacons`
      );
      return response.data.map((b: any) =>
        this._beaconResponseMapper.mapBeacon(b.attributes)
      );
    } catch (e) {
      throw e;
    }
  }

  public async getAllAccountHolders(): Promise<IAccountHolderSearchResult> {
    try {
      const response = await this._makeGetRequest(
        `/account-holder-search/search/find-all`
      );

      return response.data;
    } catch (e) {
      throw e;
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
