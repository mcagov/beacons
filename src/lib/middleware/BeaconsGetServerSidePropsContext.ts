import { GetServerSidePropsContext } from "next";
import { Session } from "../../gateways/NextAuthUserSessionGateway";
import { IAppContainer } from "../IAppContainer";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: IAppContainer;
  session: Session;
};
