import { GetServerSidePropsContext } from "next";
import { Session } from "../../gateways/userSessionGateway";
import { IAppContainer } from "../appContainer";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: IAppContainer;
  session: Session;
};
