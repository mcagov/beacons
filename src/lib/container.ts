import { GetServerSidePropsContext } from "next";
import { AppContainer } from "./appContainer";
import { withCookieRedirect } from "./middleware";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: any;
};

export const withContainer = (callback) => (
  context: BeaconsGetServerSidePropsContext
) => {
  context.container = context.container || new AppContainer();
  return callback(context);
};

export const withCookieContainer = (callback) => {
  return withCookieRedirect(withContainer(callback));
};
