/* eslint-disable no-console */

import { IAuthGateway } from "../gateways/aadAuthGateway";
import { IBeaconsApiGateway } from "../gateways/beaconsApiGateway";
import { Registration } from "../lib/registration/registration";

export interface ICreateRegistration {
  execute: (registration: Registration) => Promise<boolean>;
}

export class CreateRegistration implements ICreateRegistration {
  private apiGateway: IBeaconsApiGateway;
  private authGateway: IAuthGateway;

  constructor(apiGateway: IBeaconsApiGateway, authGateway: IAuthGateway) {
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
