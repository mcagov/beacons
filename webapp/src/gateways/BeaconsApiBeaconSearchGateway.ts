import axios from "axios";
import logger from "../logger";
import { AuthGateway } from "./interfaces/AuthGateway";
import {
  BeaconSearchGateway,
  BeaconSearchSortOptions,
} from "./interfaces/BeaconSearchGateway";
import {
  IBeaconSearchApiResponse,
  IBeaconSearchApiResponseBody,
} from "./mappers/IBeaconSearchApiResponse";

export class BeaconsApiBeaconSearchGateway implements BeaconSearchGateway {
  private readonly apiUrl: string;
  private readonly beaconSearchControllerRoute = "search";
  private readonly beaconsByAccountHolderAndEmailEndpoint =
    "beacons/find-all-by-account-holder-and-email";

  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  public async getBeaconsByAccountHolderAndEmail(
    accountHolderId: string,
    email: string,
    sortOptions: BeaconSearchSortOptions,
  ): Promise<IBeaconSearchApiResponseBody[]> {
    try {
      const url = `${this.apiUrl}/${this.beaconSearchControllerRoute}/${this.beaconsByAccountHolderAndEmailEndpoint}`;
      const { column, direction } = sortOptions;
      const sort = `${column},${direction}`;

      const response = await axios.get<IBeaconSearchApiResponse>(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
        params: {
          accountHolderId,
          email,
          sort,
        },
      });

      logger.info("Beacons retrieved by account holder id & email address");
      return response.data;
    } catch (error) {
      logger.error("getBeaconsForAccountHolder:", error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    return await this.authGateway.getAccessToken();
  }
}
