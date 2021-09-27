import axios from "axios";
import logger from "../../logger";
import { DraftRegistration } from "../entities/DraftRegistration";
import { Registration } from "../entities/Registration";
import { DeprecatedRegistration } from "../lib/deprecatedRegistration/DeprecatedRegistration";
import { AuthGateway } from "./interfaces/AuthGateway";
import { BeaconGateway } from "./interfaces/BeaconGateway";

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
    draftRegistration: DraftRegistration
  ): Promise<boolean> {
    const url = `${this.apiUrl}/${this.registrationsEndpoint}`;

    const requestBody =
      BeaconsApiBeaconGateway.draftRegistrationToApiRequestBody(
        draftRegistration
      );

    try {
      await axios.post(url, requestBody, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Registration sent");
      return true;
    } catch (error) {
      logger.error("sendRegistration:", error);
      return false;
    }
  }

  public async updateRegistration(
    draftRegistration: DraftRegistration,
    registrationId: string
  ): Promise<boolean> {
    const url = `${this.apiUrl}/${this.registrationsEndpoint}/${registrationId}`;

    const requestBody =
      BeaconsApiBeaconGateway.draftRegistrationToApiRequestBody(
        draftRegistration
      );

    try {
      await axios.patch(url, requestBody, {
        headers: { Authorization: `Bearer ${await this.getAccessToken()}` },
      });
      logger.info("Registration updated");
      return true;
    } catch (error) {
      logger.error("updateRegistration:", error);
      return false;
    }
  }

  public async deleteBeacon(json: IDeleteBeaconRequest): Promise<boolean> {
    const url = `${this.apiUrl}/beacons/${json.beaconId}/delete`;
    const data = {
      beaconId: json.beaconId,
      userId: json.accountHolderId,
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
    draftRegistration: DraftRegistration
  ) {
    return new DeprecatedRegistration(
      draftRegistration as Registration
    ).serialiseToAPI();
  }

  private async getAccessToken() {
    return await this.authGateway.getAccessToken();
  }
}
