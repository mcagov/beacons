import { GetServerSidePropsContext } from "next";
import { BeaconsSession } from "../NextAuthUserSessionGateway";

export interface UserSessionGateway {
  getSession: (
    context: GetServerSidePropsContext
  ) => Promise<BeaconsSession | null>;
}
