import axios from "axios";
import { DraftRegistration } from "../entities/DraftRegistration";
import { Registration } from "../entities/Registration";
import { DeprecatedRegistration } from "../lib/deprecatedRegistration/DeprecatedRegistration";
import { AadAuthGateway } from "./AadAuthGateway";
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

  constructor(apiUrl: string, authGateway: AuthGateway = new AadAuthGateway()) {
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
      return true;
    } catch (error) {
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
      return true;
    } catch (error) {
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
