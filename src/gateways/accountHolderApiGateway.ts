import axios, { AxiosResponse } from "axios";
import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { IBeacon } from "../entities/beacon";
import { IAccountHolderDetailsResponse } from "./mappers/accountHolderDetailsResponse";
import { IAccountHolderIdResponseBody } from "./mappers/accountHolderIdResponseBody";
import { IBeaconListResponse } from "./mappers/beaconResponse";
import { BeaconResponseMapper } from "./mappers/beaconResponseMapper";

export interface IAccountHolderApiGateway {
  createAccountHolder(
    authId: string,
    accessToken: string
  ): Promise<IAccountHolderDetails>;
  getAccountHolderId(authId: string, accessToken: string): Promise<string>;
  getAccountHolderDetails(
    accountHolderId: string,
    accessToken: string
  ): Promise<IAccountHolderDetails>;
  getAccountBeacons(
    accountHolderId: string,
    accessToken: string
  ): Promise<IBeacon[]>;
}
export class AccountHolderApiGateway implements IAccountHolderApiGateway {
  private readonly apiUrl: string;
  private readonly accountHolderControllerRoute = "account-holder";
  private readonly accountHolderIdEndpoint = "auth-id";
  private readonly accountHolderBeaconsEndpoint = "beacons";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getAccountHolderId(
    authId: string,
    accessToken: string
  ): Promise<string> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${this.accountHolderIdEndpoint}/${authId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderIdResponseBody>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.id;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // 404 is a-ok
      }
      /* eslint-disable no-console */
      console.error("getAccountHolderId:", JSON.stringify(error));
      throw error;
    }
  }

  public async createAccountHolder(
    authId: string,
    accessToken: string
  ): Promise<IAccountHolderDetails> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}`;
    try {
      const request = {
        data: { attributes: { authId } },
      } as IAccountHolderDetailsResponse;
      const response = await axios.post<
        any,
        AxiosResponse<IAccountHolderDetailsResponse>
      >(url, request, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return {
        id: response.data.data.id,
        ...response.data.data.attributes,
      };
    } catch (error) {
      /* eslint-disable no-console */
      console.error("createAccountHolderId:", JSON.stringify(error));
      throw error;
    }
  }

  public async getAccountHolderDetails(
    accountHolderId: string,
    accessToken: string
  ): Promise<IAccountHolderDetails> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${accountHolderId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderDetailsResponse>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return {
        id: response.data.data.id,
        ...response.data.data.attributes,
      };
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getAccountHolderDetails:", error);
      throw error;
    }
  }

  public async getAccountBeacons(
    accountHolderId: string,
    accessToken: string
  ): Promise<IBeacon[]> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${accountHolderId}/${this.accountHolderBeaconsEndpoint}`;
    try {
      const response = await axios.get<any, AxiosResponse<IBeaconListResponse>>(
        url,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return new BeaconResponseMapper().mapList(response.data);
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getAccountBeacons:", error);
      throw error;
    }
  }
}
