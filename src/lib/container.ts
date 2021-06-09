import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { AppContainer, IAppContainer } from "./appContainer";
import { withCookieRedirect } from "./middleware";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: IAppContainer;
};

export const withContainer = (callback: GetServerSideProps) => (
  context: BeaconsGetServerSidePropsContext
) => {
  context.container = context.container || new AppContainer();
  return callback(context);
};

export const withCookieRedirectContainer = (callback: GetServerSideProps) => {
  return withContainer(withCookieRedirect(callback));
};
