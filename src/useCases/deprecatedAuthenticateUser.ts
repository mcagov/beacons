import { GetServerSidePropsContext } from "next";
import { IBasicAuthGateway } from "../gateways/BasicAuthGateway";

export interface DeprecatedIAuthenticateUser {
  execute: (context: GetServerSidePropsContext) => Promise<void>;
}

export class DeprecatedAuthenticateUser implements DeprecatedIAuthenticateUser {
  private gateway: IBasicAuthGateway;

  constructor(basicAuthGateway: IBasicAuthGateway) {
    this.gateway = basicAuthGateway;
  }

  async execute(context: GetServerSidePropsContext): Promise<void> {
    await this.gateway.authenticate(context.req, context.res);
  }
}
