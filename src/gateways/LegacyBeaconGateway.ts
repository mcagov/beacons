import axios from "axios";
import { LegacyBeaconGatewayInterface } from "./interfaces/LegacyBeaconGateway";
import { ILegacyBeaconRequest } from "./interfaces/LegacyBeaconRequest";

export class LegacyBeaconGateway implements LegacyBeaconGatewayInterface {
  private readonly apiUrl: string;
  private readonly legacyBeaconEndpoint = "legacy-beacon";
  private readonly migrateLegacyBeaconEndpoint = "migrate/legacy-beacon";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getLegacyBeacon(legacyBeaconId: string) {
    try {
      const url = `${this.apiUrl}/${this.legacyBeaconEndpoint}/${legacyBeaconId}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  public async create(legacyBeaconRequest: ILegacyBeaconRequest) {
    try {
      const url = `${this.apiUrl}/${this.migrateLegacyBeaconEndpoint}`;
      const response = await axios.post(url, legacyBeaconRequest);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
