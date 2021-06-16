import axios, { AxiosResponse } from "axios";
import {
  IAccountBeacon,
  IAccountHolderBeaconsResponseBody,
} from "../lib/accountHolder/accountBeacons";
import {
  IAccountHolderDetails,
  IAccountHolderDetailsRequestResponseBody,
} from "../lib/accountHolder/accountHolderDetails";
import { IAccountHolderIdResponseBody } from "../lib/accountHolder/accountHolderIdResponseBody";

export interface IAccountHolderApiGateway {
  createAccountHolderId(authId: string, accessToken: string): Promise<string>;
  getAccountHolderId(authId: string, accessToken: string): Promise<string>;
  getAccountHolderDetails(
    accountHolderId: string,
    accessToken: string
  ): Promise<IAccountHolderDetails>;
  getAccountBeacons(
    accountHolderId: string,
    accessToken: string
  ): Promise<IAccountBeacon[]>;
}
export class AccountHolderApiGateway implements IAccountHolderApiGateway {
  private readonly apiUrl: string;
  private readonly accountHolderRoute = "account-holder";
  private readonly accountHolderIdEndpoint = "auth-id";
  private readonly accountHolderBeaconsEndpoint = "/beacons";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getAccountHolderId(
    authId: string,
    accessToken: string
  ): Promise<string> {
    const url = `${this.apiUrl}/${this.accountHolderRoute}/${this.accountHolderIdEndpoint}/${authId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderIdResponseBody>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.id;
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getAccountHolderId:", JSON.stringify(error));
      throw error;
    }
  }

  public async createAccountHolderId(
    authId: string,
    accessToken: string
  ): Promise<string> {
    const url = `${this.apiUrl}/${this.accountHolderRoute}`;
    try {
      const request = {
        data: { attributes: { authId } },
      } as IAccountHolderDetailsRequestResponseBody;
      const response = await axios.post<
        any,
        AxiosResponse<IAccountHolderIdResponseBody>
      >(url, request, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.id;
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
    const url = `${this.apiUrl}/${this.accountHolderRoute}/${accountHolderId}/${this.accountHolderBeaconsEndpoint}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderDetailsRequestResponseBody>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return {
        id: response.data.data.id,
        ...response.data.data.attributes,
      };
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getAccountHolderDetails:", JSON.stringify(error));
      throw error;
    }
  }

  public async getAccountBeacons(
    accountHolderId: string,
    accessToken: string
  ): Promise<IAccountBeacon[]> {
    const url = `${this.apiUrl}/${this.accountHolderRoute}/${accountHolderId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderBeaconsResponseBody>
      >(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data.data.map((d) => {
        return {
          id: d.id,
          ...d.attributes,
        };
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getAccountHolderDetails:", JSON.stringify(error));
      throw error;
    }
  }
}
