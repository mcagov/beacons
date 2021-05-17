import axios from "axios";
import { IRegistration } from "../lib/registration/types";

export class BeaconsApiGateway {
  private apiUrl: string;
  private registrationsEndpoint = "registrations/register";

  constructor() {
    this.apiUrl = process.env.API_URL;
  }

  public async sendRegistration(
    json: Partial<IRegistration>
  ): Promise<boolean> {
    const url = `${this.apiUrl}/${this.registrationsEndpoint}`;

    try {
      await axios.post(url, json);
      return true;
    } catch (error) {
      return false;
    }
  }
}
