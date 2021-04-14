import { BasicAuthGateway } from "../gateways/basicAuthGateway";

export class AuthenticateUser {
  gateway;
  constructor(BasicAuthGateway: BasicAuthGateway) {
    this.gateway = BasicAuthGateway;
  }

  async execute(context): Promise<void> {
    await this.gateway.authenticate(context.req, context.res);
  }
}
