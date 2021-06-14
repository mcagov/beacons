import { GetServerSidePropsContext } from "next";
import { IBasicAuthGateway } from "../gateways/basicAuthGateway";
import { IAppContainer } from "../lib/appContainer";

export type AuthenticateUserFn = (
  context: GetServerSidePropsContext
) => Promise<void>;

export const authenticateUser = ({
  basicAuthGateway,
}: IAppContainer): AuthenticateUserFn => async (
  context: GetServerSidePropsContext
): Promise<void> => {
  await basicAuthGateway.authenticate(context.req, context.res);
};

/* Legacy -- delete once not used */

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
