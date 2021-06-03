/* eslint-disable no-console */

import { BeaconsApiGateway } from "../gateways/beaconsApiGateway";
import { IAuthGateway } from "../gateways/IAuthGateway";
import { Registration } from "../lib/registration/registration";

export class CreateRegistration {
  private apiGateway: BeaconsApiGateway;
  private authGateway: IAuthGateway;

  constructor(apiGateway: BeaconsApiGateway, authGateway: IAuthGateway) {
    this.apiGateway = apiGateway;
    this.authGateway = authGateway;
  }

  public async execute(registration: Registration): Promise<boolean> {
    try {
      const registrationJson = registration.serialiseToAPI();
      const accessToken = await this.authGateway.getAccessToken();

      return this.apiGateway.sendRegistration(registrationJson, accessToken);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
