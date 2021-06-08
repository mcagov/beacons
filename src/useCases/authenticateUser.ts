import { GetServerSidePropsContext } from "next";
import { IBasicAuthGateway } from "../gateways/basicAuthGateway";

export interface IAuthenticateUser {
  execute: (context: GetServerSidePropsContext) => Promise<void>;
}

export class AuthenticateUser implements IAuthenticateUser {
  private gateway: IBasicAuthGateway;

  constructor(basicAuthGateway: IBasicAuthGateway) {
    this.gateway = basicAuthGateway;
  }

  async execute(context: GetServerSidePropsContext): Promise<void> {
    await this.gateway.authenticate(context.req, context.res);
  }
}
