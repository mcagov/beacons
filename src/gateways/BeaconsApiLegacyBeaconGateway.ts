import axios from "axios";
import { LegacyBeacon } from "../entities/LegacyBeacon";
import { AuthGateway } from "./interfaces/AuthGateway";
import { LegacyBeaconGateway } from "./interfaces/LegacyBeaconGateway";

export class BeaconsApiLegacyBeaconGateway implements LegacyBeaconGateway {
  private readonly apiDomainName: string;
  private readonly authGateway: AuthGateway;
  private readonly apiResourceName = "legacy-beacon";

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiDomainName = apiUrl;
    this.authGateway = authGateway;
  }

  public async getById(id: string): Promise<LegacyBeacon> {
    const url = `${this.apiDomainName}/${this.apiResourceName}/${id}`;
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
