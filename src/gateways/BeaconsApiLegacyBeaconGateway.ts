import axios from "axios";
import { LegacyBeacon } from "../entities/LegacyBeacon";
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

  public async getLegacyBeacon(legacyBeaconId: string): Promise<LegacyBeacon> {
    const url = `${this.apiUrl}/${this.legacyBeaconEndpoint}/${legacyBeaconId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${await this.authGateway.getAccessToken()}`,
      },
    });
    return BeaconsApiLegacyBeaconGateway.legacyBeaconResponseToLegacyBeacon(
      response.data
    );
  }

  private static legacyBeaconResponseToLegacyBeacon(
    legacyBeaconResponse: any
  ): LegacyBeacon {
    return {
      id: legacyBeaconResponse.data.id,
      hexId: legacyBeaconResponse.data.attributes.beacon.hexId,
      manufacturer: legacyBeaconResponse.data.attributes.beacon.manufacturer,
      model: legacyBeaconResponse.data.attributes.beacon.model,
      ownerEmail: legacyBeaconResponse.data.attributes.owner.email,
      dateFirstRegistered:
        legacyBeaconResponse.data.attributes.beacon.firstRegistrationDate,
      dateLastUpdated:
        legacyBeaconResponse.data.attributes.beacon.lastModifiedDate,
    };
  }
}
