import axios, { AxiosResponse } from "axios";
import { applicationConfig } from "config";
import { IBeacon } from "entities/IBeacon";
import { IDeleteBeaconDto } from "entities/IDeleteBeaconDto";
import { IBeaconSearchResult } from "entities/IBeaconSearchResult";
import { IAuthGateway } from "gateways/auth/IAuthGateway";
import { IBeaconRequestMapper } from "gateways/mappers/BeaconRequestMapper";
import { IBeaconResponseMapper } from "gateways/mappers/BeaconResponseMapper";
import { logToServer } from "../../utils/logger";
import {
  GetAllBeaconsFilters,
  GetAllBeaconsSort,
  IBeaconsGateway,
} from "./IBeaconsGateway";

export class BeaconsGateway implements IBeaconsGateway {
  private _beaconResponseMapper;
  private _beaconRequestMapper;
  private _authGateway;

  public constructor(
    beaconResponseMapper: IBeaconResponseMapper,
    beaconRequestMapper: IBeaconRequestMapper,
    authGateway: IAuthGateway,
  ) {
    this._beaconRequestMapper = beaconRequestMapper;
    this._beaconResponseMapper = beaconResponseMapper;
    this._authGateway = authGateway;
  }

  public async getAllBeacons(
    term: string = "",
    filters: GetAllBeaconsFilters = {},
    page: number = 0,
    size: number = 20,
    sort: GetAllBeaconsSort = null,
  ): Promise<IBeaconSearchResult> {
    try {
      const response = await this._makeGetRequest(
        BeaconsGateway._makeGetAllBeaconsQuery(term, filters, page, size, sort),
      );
      return response.data;
    } catch (e) {
      logToServer.error(e);
      throw e;
    }
  }

  public async getBeacon(beaconId: string): Promise<IBeacon> {
    try {
      const response = await this._makeGetRequest(`/registrations/${beaconId}`);
      return this._beaconResponseMapper.map(response.data);
    } catch (e) {
      throw e;
    }
  }

  public async updateBeacon(
    beaconId: string,
    updatedFields: Partial<IBeacon>,
  ): Promise<IBeacon> {
    try {
      const response = await this._makePatchRequest(
        `/beacons/${beaconId}`,
        beaconId,
        updatedFields,
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async deleteBeacon(
    deleteBeaconDto: IDeleteBeaconDto,
  ): Promise<AxiosResponse> {
    try {
      const data = {
        beaconId: deleteBeaconDto.beaconId,
        reason: deleteBeaconDto.reason,
      };
      const accessToken = await this._authGateway.getAccessToken();

      const response = await axios.patch(
        `${applicationConfig.apiUrl}/delete/backoffice`,
        data,
        {
          timeout: applicationConfig.apiTimeoutMs,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
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
    beaconId: string,
    updatedFields: Partial<IBeacon>,
  ): Promise<AxiosResponse> {
    const accessToken = await this._authGateway.getAccessToken();

    return await axios.patch(
      `${applicationConfig.apiUrl}${path}`,
      this._beaconRequestMapper.map(beaconId, updatedFields),
      {
        timeout: applicationConfig.apiTimeoutMs,
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  }

  private static _makeGetAllBeaconsQuery(
    term: string = "",
    filters: GetAllBeaconsFilters,
    page: number = 0,
    size: number = 20,
    sort: GetAllBeaconsSort,
  ): string {
    const {
      hexId = "",
      ownerName = "",
      useActivities: uses = "",
      beaconStatus: status = "",
      cospasSarsatNumber = "",
      manufacturerSerialNumber = "",
    } = filters;

    const sortString = sort ? `${sort[0]},${sort[1]}` : "";

    return `/search/beacons/find-all?term=${term}&status=${status}&uses=${uses}&hexId=${hexId}\
&ownerName=${ownerName}&cospasSarsatNumber=${cospasSarsatNumber}\
&manufacturerSerialNumber=${manufacturerSerialNumber}&page=${page}&size=${size}&sort=${sortString}`;
  }
}
