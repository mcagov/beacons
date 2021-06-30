import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/client";

export interface Session {
  user?: {
    authId?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires?: string;
}

export interface IUserSessionGateway {
  getSession: (context: GetServerSidePropsContext) => Promise<Session | null>;
}

export class UserSessionGateway implements IUserSessionGateway {
  public async getSession(
    context: GetServerSidePropsContext
  ): Promise<Session | null> {
    return await getSession(context);
  }
}
