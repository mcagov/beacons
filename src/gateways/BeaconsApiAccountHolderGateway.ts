import axios, { AxiosResponse } from "axios";
import { AccountHolder } from "../entities/AccountHolder";
import { Beacon } from "../entities/Beacon";
import { AadAuthGateway } from "./AadAuthGateway";
import { AccountHolderGateway } from "./interfaces/AccountHolderGateway";
import { AuthGateway } from "./interfaces/AuthGateway";
import { BeaconsApiResponseMapper } from "./mappers/BeaconsApiResponseMapper";
import { IAccountHolderDetailsResponse } from "./mappers/IAccountHolderDetailsResponse";
import { IAccountHolderIdResponseBody } from "./mappers/IAccountHolderIdResponseBody";
import { IBeaconListResponse } from "./mappers/IBeaconListResponse";

export class BeaconsApiAccountHolderGateway implements AccountHolderGateway {
  private readonly apiUrl: string;
  private readonly accountHolderControllerRoute = "account-holder";
  private readonly accountHolderIdEndpoint = "auth-id";
  private readonly accountHolderBeaconsEndpoint = "beacons";
  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway = new AadAuthGateway()) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  public async getAccountHolderId(authId: string): Promise<string> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${this.accountHolderIdEndpoint}/${authId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderIdResponseBody>
      >(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
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
    email: string
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
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
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
    accountHolderId: string
  ): Promise<AccountHolder> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${accountHolderId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderDetailsResponse>
      >(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
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
    update: AccountHolder
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
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
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

  public async getAccountBeacons(accountHolderId: string): Promise<Beacon[]> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${accountHolderId}/${this.accountHolderBeaconsEndpoint}`;
    try {
      const response = await axios.get<any, AxiosResponse<IBeaconListResponse>>(
        url,
        {
          headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
        }
      );

      return new BeaconsApiResponseMapper().mapList(response.data);
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getAccountBeacons:", error);
      throw error;
    }
  }

  private async getAccessToken() {
    return await this.authGateway.getAccessToken();
  }
}
