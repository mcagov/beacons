import axios, { AxiosResponse } from "axios";
import { AccountHolder } from "../entities/AccountHolder";
import { Beacon } from "../entities/Beacon";
import { AccountHolderGateway } from "./interfaces/AccountHolderGateway";
import { BeaconsApiResponseMapper } from "./mappers/BeaconsApiResponseMapper";
import { IAccountHolderDetailsResponse } from "./mappers/IAccountHolderDetailsResponse";
import { IAccountHolderIdResponseBody } from "./mappers/IAccountHolderIdResponseBody";
import { IBeaconListResponse } from "./mappers/IBeaconListResponse";

export class BeaconsApiAccountHolderGateway implements AccountHolderGateway {
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
    email: string,
    accessToken: string
  ): Promise<AccountHolder> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}`;
    try {
      const request = {
        data: { attributes: { authId, email } },
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
  ): Promise<AccountHolder> {
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

  public async updateAccountHolderDetails(
    accountHolderId: string,
    update: AccountHolder,
    accessToken: string
  ): Promise<AccountHolder> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${accountHolderId}`;
    try {
      const request = {
        data: {
          id: accountHolderId,
          attributes: update,
        },
      };
      const response = await axios.patch<
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
      console.error("updateAccountHolderDetails:", JSON.stringify(error));
      throw error;
    }
  }

  public async getAccountBeacons(
    accountHolderId: string,
    accessToken: string
  ): Promise<Beacon[]> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${accountHolderId}/${this.accountHolderBeaconsEndpoint}`;
    try {
      const response = await axios.get<any, AxiosResponse<IBeaconListResponse>>(
        url,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      return new BeaconsApiResponseMapper().mapList(response.data);
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getAccountBeacons:", error);
      throw error;
    }
  }
}
