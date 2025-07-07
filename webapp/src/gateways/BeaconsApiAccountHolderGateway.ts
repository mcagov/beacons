import axios, { AxiosResponse } from "axios";
import { AccountHolder } from "../entities/AccountHolder";
import { Beacon } from "../entities/Beacon";
import { RegistrationResponse } from "../lib/deprecatedRegistration/IRegistrationResponseBody";
import logger from "../logger";
import { AccountHolderGateway } from "./interfaces/AccountHolderGateway";
import { AuthGateway } from "./interfaces/AuthGateway";
import { BeaconsApiResponseMapper } from "./mappers/BeaconsApiResponseMapper";
import { IAccountHolderDetailsResponse } from "./mappers/IAccountHolderDetailsResponse";

export class BeaconsApiAccountHolderGateway implements AccountHolderGateway {
  private readonly apiUrl: string;
  private readonly accountHolderControllerRoute = "account-holder";
  private readonly registrationControllerRoute = "registrations";
  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  public async getAccountHolderId(authId: string): Promise<string> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}?authId=${authId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderDetailsResponse>
      >(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Account holder id retrieved");
      return response.data.data.id;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // 404 is a-ok
      }
      logger.error("getAccountHolderId:", error);
      throw error;
    }
  }

  public async createAccountHolder(
    authId: string,
    email: string,
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
      logger.info("Account holder created");
      return {
        id: response.data.data.id,
        ...response.data.data.attributes,
      };
    } catch (error) {
      logger.error("createAccountHolderId:", error);
      throw error;
    }
  }

  public async getAccountHolderDetails(
    accountHolderId: string,
  ): Promise<AccountHolder> {
    const url = `${this.apiUrl}/${this.accountHolderControllerRoute}/${accountHolderId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<IAccountHolderDetailsResponse>
      >(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Account holder details retrieved");
      return {
        id: response.data.data.id,
        ...response.data.data.attributes,
      };
    } catch (error) {
      logger.error("getAccountHolderDetails:", error);
      throw error;
    }
  }

  public async updateAccountHolderDetails(
    accountHolderId: string,
    update: AccountHolder,
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
      logger.info("Account holder details updated");
      return {
        id: response.data.data.id,
        ...response.data.data.attributes,
      };
    } catch (error) {
      logger.error("updateAccountHolderDetails:", error);
      throw error;
    }
  }

  public async getAccountBeacons(accountHolderId: string): Promise<Beacon[]> {
    const url = `${this.apiUrl}/${this.registrationControllerRoute}?accountHolderId=${accountHolderId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<RegistrationResponse[]>
      >(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Account beacons retrieved");
      return new BeaconsApiResponseMapper().mapList(response.data);
    } catch (error) {
      logger.error("getAccountBeacons:", error);
      throw error;
    }
  }

  public async getAccountBeacon(
    accountHolderId: string,
    registrationId: string,
  ): Promise<Beacon> {
    const url = `${this.apiUrl}/${this.registrationControllerRoute}/${accountHolderId}/registration/${registrationId}`;
    try {
      const response = await axios.get<
        any,
        AxiosResponse<RegistrationResponse>
      >(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Account beacon retrieved");
      return new BeaconsApiResponseMapper().map(response.data);
    } catch (error) {
      logger.error("getAccountBeacon:", error);
      throw error;
    }
  }

  private async getAccessToken() {
    return await this.authGateway.getAccessToken();
  }
}
