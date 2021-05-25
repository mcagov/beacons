import axios from "axios";
import { IRegistrationRequestBody } from "../lib/registration/iRegistrationRequestBody";
import { IAuthGateway } from "./IAuthGateway";

export class BeaconsApiGateway {
  private apiUrl: string;
  private registrationsEndpoint = "registrations/register";
  private authGateway: IAuthGateway;

  constructor(authGateway: IAuthGateway) {
    this.apiUrl = process.env.API_URL;
    this.authGateway = authGateway;
  }

  public async sendRegistration(
    json: IRegistrationRequestBody
  ): Promise<boolean> {
    const url = `${this.apiUrl}/${this.registrationsEndpoint}`;

    const accessToken = await this.authGateway.getAccessToken();

    try {
      await axios.post(url, json, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
