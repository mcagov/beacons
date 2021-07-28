import { GetServerSidePropsContext } from "next";
import { IAppContainer } from "../lib/IAppContainer";

export type AuthenticateUserFn = (
  context: GetServerSidePropsContext
) => Promise<void>;
export const authenticateUser =
  ({ basicAuthGateway }: IAppContainer): AuthenticateUserFn =>
  async (context: GetServerSidePropsContext): Promise<void> => {
    await basicAuthGateway.authenticate(context.req, context.res);
  };
