import axios from "axios";
import { LegacyBeacon } from "../entities/LegacyBeacon";
import logger from "../logger";
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
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${await this.authGateway.getAccessToken()}`,
        },
      });
      logger.info("Legacy beacon retrieved");
      return BeaconsApiLegacyBeaconGateway.legacyBeaconResponseToLegacyBeacon(
        response.data
      );
    } catch (error) {
      logger.error("getLegacyBeacon:", error);
      throw error;
    }
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
      csta: legacyBeaconResponse.data.attributes.beacon.csta || null,
      manufacturerSerialNumber:
        legacyBeaconResponse.data.attributes.beacon.manufacturerSerialNumber ||
        null,
      ownerName: legacyBeaconResponse.data.attributes.owner.ownerName,
      ownerAddress1: legacyBeaconResponse.data.attributes.owner.address1,
      ownerAddress2: legacyBeaconResponse.data.attributes.owner.address2,
      ownerAddress3: legacyBeaconResponse.data.attributes.owner.address3,
      ownerAddress4: legacyBeaconResponse.data.attributes.owner.address4,
      ownerPostcode: legacyBeaconResponse.data.attributes.owner.postCode,
    };
  }
}
