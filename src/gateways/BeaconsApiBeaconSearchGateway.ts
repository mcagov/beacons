import axios from "axios";
import { AuthGateway } from "./interfaces/AuthGateway";
import {
  BeaconSearchGateway,
  BeaconSearchSortOptions,
} from "./interfaces/BeaconSearchGateway";
import { IBeaconSearchApiResponse } from "./mappers/IBeaconSearchApiResponse";

export class BeaconsApiBeaconSearchGateway implements BeaconSearchGateway {
  private readonly apiUrl: string;
  private readonly beaconSearchControllerRoute = "beacon-search";
  private readonly beaconsByAccountHolderAndEmailEndpoint =
    "search/find-all-for-account-holder";

  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  public async getBeaconsByAccountHolderAndEmail(
    accountHolderId: string,
    email: string,
    sortOptions: BeaconSearchSortOptions
  ): Promise<IBeaconSearchApiResponse[]> {
    try {
      const url = `${this.apiUrl}/${this.beaconSearchControllerRoute}/${this.beaconsByAccountHolderAndEmailEndpoint}`;
      const { column, direction } = sortOptions;
      const sort = `${column},${direction}`;

      return await axios.get<any, IBeaconSearchApiResponse[]>(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
        params: {
          accountHolderId,
          email,
          sort,
        },
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getBeaconsForAccountHolder", error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    return await this.authGateway.getAccessToken();
  }
}
