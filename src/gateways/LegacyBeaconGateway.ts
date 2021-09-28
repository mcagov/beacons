import axios from "axios";
import logger from "../logger";
import { LegacyBeaconGateway } from "./interfaces/LegacyBeaconGateway";

export class BeaconsApiLegacyBeaconGateway implements LegacyBeaconGateway {
  private readonly apiUrl: string;
  private readonly legacyBeaconEndpoint = "legacy-beacon";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getLegacyBeacon(legacyBeaconId: string) {
    try {
      const url = `${this.apiUrl}/${this.legacyBeaconEndpoint}/${legacyBeaconId}`;
      const response = await axios.get(url);
      logger.info("Legacy beacon retrieved");
      return response.data;
    } catch (error) {
      logger.error("getLegacyBeacon:", error);
      return error;
    }
  }
}
