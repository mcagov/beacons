import axios from "axios";
import { AuthGateway } from "./interfaces/AuthGateway";
import { BeaconSearchGateway } from "./interfaces/BeaconSearchGateway";
import { IBeaconSearchApiResponse } from "./mappers/IBeaconSearchApiResponse";

export class BeaconsApiBeaconSearchGateway implements BeaconSearchGateway {
  private readonly apiUrl: string;
  private readonly beaconSearchControllerRoute = "beacon-search";
  private readonly beaconsForAccountHolderEndpoint =
    "search/find-all-for-account-holder";

  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  public async getBeaconsForAccountHolder(
    accountHolderId: string,
    email: string
  ): Promise<IBeaconSearchApiResponse> {
    try {
      const url = `${this.apiUrl}/${this.beaconSearchControllerRoute}/${this.beaconsForAccountHolderEndpoint}`;

      return await axios.get<any, IBeaconSearchApiResponse>(url, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.error("getBeaconsForAccountHolder", error);
      throw error;
    }
  }

  private async getAccessToken() {
    return await this.authGateway.getAccessToken();
  }
}
