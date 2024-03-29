import { GetServerSidePropsContext } from "next";
import { BeaconsSession } from "../../gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../IAppContainer";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: Partial<IAppContainer>;
  session: BeaconsSession;
};
