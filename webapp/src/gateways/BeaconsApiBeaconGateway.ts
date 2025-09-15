import axios from "axios";
import { DraftRegistration } from "../entities/DraftRegistration";
import { Registration } from "../entities/Registration";
import { DeprecatedRegistration } from "../lib/deprecatedRegistration/DeprecatedRegistration";
import logger from "../logger";
import { AuthGateway } from "./interfaces/AuthGateway";
import { BeaconGateway } from "./interfaces/BeaconGateway";
import { RedisDraftRegistrationGateway } from "./RedisDraftRegistrationGateway";

export interface IDeleteBeaconRequest {
  beaconId: string;
  accountHolderId: string;
  reason: string;
}

export class BeaconsApiBeaconGateway implements BeaconGateway {
  private readonly apiUrl: string;
  private readonly registrationsEndpoint = "registrations/register";
  private readonly authGateway: AuthGateway;

  constructor(apiUrl: string, authGateway: AuthGateway) {
    this.apiUrl = apiUrl;
    this.authGateway = authGateway;
  }

  public async sendRegistration(
    draftRegistration: DraftRegistration,
  ): Promise<boolean> {
    const url = `${this.apiUrl}/${this.registrationsEndpoint}`;

    const requestBody =
      BeaconsApiBeaconGateway.draftRegistrationToApiRequestBody(
        draftRegistration,
      );

    try {
      await axios.post(url, requestBody, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Registration sent");
      await this.scheduleDraftDeletion(draftRegistration);
      return true;
    } catch (error) {
      logger.error("sendRegistration:", error);
      return false;
    }
  }

  public async updateRegistration(
    draftRegistration: DraftRegistration,
    registrationId: string,
  ): Promise<boolean> {
    const url = `${this.apiUrl}/${this.registrationsEndpoint}/${registrationId}`;

    const requestBody =
      BeaconsApiBeaconGateway.draftRegistrationToApiRequestBody(
        draftRegistration,
      );

    try {
      await axios.patch(url, requestBody, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Registration updated");
      await this.scheduleDraftDeletion(draftRegistration);
      return true;
    } catch (error) {
      logger.error("updateRegistration:", error);
      return false;
    }
  }

  public async deleteBeacon(json: IDeleteBeaconRequest): Promise<boolean> {
    const url = `${this.apiUrl}/registrations/${json.beaconId}/delete`;
    const data = {
      beaconId: json.beaconId,
      accountHolderId: json.accountHolderId,
      reason: json.reason,
    };

    try {
      await axios.patch(url, data, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Beacon deleted");
      return true;
    } catch (error) {
      logger.error("deleteBeacon:", error);
      return false;
    }
  }

  private static draftRegistrationToApiRequestBody(
    draftRegistration: DraftRegistration,
  ) {
    return new DeprecatedRegistration(
      draftRegistration as Registration,
    ).serialiseToAPI();
  }

  private async scheduleDraftDeletion(draftRegistration: DraftRegistration) {
    if (draftRegistration.id) {
      setTimeout(async () => {
        const redisGateway = new RedisDraftRegistrationGateway();
        await redisGateway.delete(draftRegistration.id);
        logger.info(
          `Draft ${draftRegistration.id} scheduled for deletion after 6 hours`,
        );
      }, 21600000);
    }
  }

  private async getAccessToken() {
    return await this.authGateway.getAccessToken();
  }
}
