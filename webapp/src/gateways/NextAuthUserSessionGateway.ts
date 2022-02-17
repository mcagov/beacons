import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/client";
import { UserSessionGateway } from "./interfaces/UserSessionGateway";

export interface BeaconsSession {
  user?: {
    authId?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires?: string;
}

export class NextAuthUserSessionGateway implements UserSessionGateway {
  public async getSession(
    context: GetServerSidePropsContext
  ): Promise<BeaconsSession | null> {
    return await getSession(context);
  }
}
