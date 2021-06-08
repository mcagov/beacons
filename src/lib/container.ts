import { GetServerSidePropsContext } from "next";
import { AppContainer } from "./appContainer";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: any;
};

export const withContainer = (callback) => (
  context: BeaconsGetServerSidePropsContext
) => {
  context.container = context.container || new AppContainer();
  return callback(context);
};
