import axios from "axios";
import { LegacyBeaconGatewayInterface } from "./interfaces/LegacyBeaconGateway";

export class LegacyBeaconGateway implements LegacyBeaconGatewayInterface {
  private readonly apiUrl: string;
  private readonly legacyBeaconEndpoint = "legacy-beacon";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getLegacyBeacon(legacyBeaconId: string) {
    try {
      const url = `${this.apiUrl}/${this.legacyBeaconEndpoint}/${legacyBeaconId}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
}
