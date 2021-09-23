import axios from "axios";
import { AuthGateway } from "./interfaces/AuthGateway";
import { LegacyBeaconGateway } from "./interfaces/LegacyBeaconGateway";

export class BeaconsApiLegacyBeaconGateway implements LegacyBeaconGateway {
  private readonly apiUrl: string;
  private readonly legacyBeaconEndpoint = "legacy-beacon";
  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  public async getLegacyBeacon(legacyBeaconId: string) {
    try {
      const url = `${this.apiUrl}/${this.legacyBeaconEndpoint}/${legacyBeaconId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${await this.authGateway.getAccessToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }
}
