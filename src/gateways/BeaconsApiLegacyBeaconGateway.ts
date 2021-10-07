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
      mti: legacyBeaconResponse.data.attributes.beacon.mti || null,
      csta: legacyBeaconResponse.data.attributes.beacon.csta || null,
      coding: legacyBeaconResponse.data.attributes.beacon?.coding || null,
      protocol: legacyBeaconResponse.data.attributes.beacon?.protocol || null,
      beaconType:
        legacyBeaconResponse.data.attributes.beacon?.beaconType || null,
      manufacturerSerialNumber:
        legacyBeaconResponse.data.attributes.beacon.manufacturerSerialNumber,
      serialNumber: legacyBeaconResponse.data.attributes.beacon.serialNumber,
      cospasSarsatNumber:
        legacyBeaconResponse.data.attributes.beacon.cospasSarsatNumber,
      ownerName: legacyBeaconResponse.data.attributes.owner.ownerName,
      ownerAddress1: legacyBeaconResponse.data.attributes.owner.address1,
      ownerAddress2: legacyBeaconResponse.data.attributes.owner.address2,
      ownerAddress3: legacyBeaconResponse.data.attributes.owner.address3,
      ownerAddress4: legacyBeaconResponse.data.attributes.owner.address4,
      ownerPostcode: legacyBeaconResponse.data.attributes.owner.postCode,
    };
  }
}
