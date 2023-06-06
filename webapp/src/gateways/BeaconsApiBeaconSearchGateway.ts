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
  private readonly beaconSearchControllerRoute = "beacon-search";
  private readonly beaconsByAccountHolderAndEmailEndpoint =
    "search/find-all-by-account-holder-and-email";

  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  // why do we search for acc holder id and email?
  // why not just get account holder by id and take the email from the resulting acc holder?
  public async getBeaconsByAccountHolderAndEmail(
    accountHolderId: string,
    email: string,
    sortOptions: BeaconSearchSortOptions
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
      return response.data._embedded.beaconSearch;
    } catch (error) {
      logger.error("getBeaconsForAccountHolder:", error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    return await this.authGateway.getAccessToken();
  }
}
