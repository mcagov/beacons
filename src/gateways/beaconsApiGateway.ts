import axios from "axios";
import { IRegistrationRequestBody } from "../lib/registration/iRegistrationRequestBody";

export interface IBeaconsApiGateway {
  sendRegistration: (
    json: IRegistrationRequestBody,
    accessToken: string
  ) => Promise<boolean>;
}

export class BeaconsApiGateway implements IBeaconsApiGateway {
  private readonly apiUrl: string;
  private readonly registrationsEndpoint = "registrations/register";

  constructor() {
    this.apiUrl = process.env.API_URL;
  }

  public async sendRegistration(
    json: IRegistrationRequestBody,
    accessToken: string
  ): Promise<boolean> {
    const url = `${this.apiUrl}/${this.registrationsEndpoint}`;

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
