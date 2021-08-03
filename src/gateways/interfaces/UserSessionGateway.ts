import { GetServerSidePropsContext } from "next";
import { Session } from "../NextAuthUserSessionGateway";

export interface UserSessionGateway {
  getSession: (context: GetServerSidePropsContext) => Promise<Session | null>;
}
