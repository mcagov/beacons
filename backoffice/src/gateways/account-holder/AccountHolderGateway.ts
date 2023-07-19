import axios, { AxiosResponse } from "axios";
import { applicationConfig } from "config";
import { IBeacon } from "entities/IBeacon";
import { logToServer } from "../../utils/logger";
import { IAccountHolder } from "../../entities/IAccountHolder";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IAccountHolderGateway } from "./IAccountHolderGateway";
import { IBeaconResponseMapper } from "gateways/mappers/BeaconResponseMapper";
import { IAccountHolderSearchResult } from "../../entities/IAccountHolderSearchResult";

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
      logToServer.error(e);
      throw e;
    }
  }

  public async updateAccountHolder(
    accountHolderId: string,
    updatedFields: Partial<IAccountHolder>
  ): Promise<IAccountHolder> {
    const data = {
      data: {
        id: accountHolderId,
        attributes: updatedFields,
      },
    };

    const response = await this._makePatchRequest(
      `/account-holder/${accountHolderId}`,
      data
    );

    // switch
    if (response.status === 500) {
      throw new Error(
        `500 error: could not update account holder ${accountHolderId} in Azure`
      );
    } else if (response.status === 404) {
      throw new Error(
        `404 error: could not get account holder ${accountHolderId} in Azure`
      );
    } else {
      return response.data;
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
      logToServer.error(e);
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

  private async _makePatchRequest(
    path: string,
    payload: {}
  ): Promise<AxiosResponse> {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios.patch(`${applicationConfig.apiUrl}${path}`, payload, {
      timeout: applicationConfig.apiTimeoutMs,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
