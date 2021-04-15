import { GetServerSidePropsContext } from "next";
import { BasicAuthGateway } from "../gateways/basicAuthGateway";

export class AuthenticateUser {
  gateway;
  constructor(BasicAuthGateway: BasicAuthGateway) {
    this.gateway = BasicAuthGateway;
  }

  async execute(context: GetServerSidePropsContext): Promise<void> {
    await this.gateway.authenticate(context.req, context.res);
  }
}
