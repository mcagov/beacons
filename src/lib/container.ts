import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { AppContainer, IAppContainer } from "./appContainer";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: IAppContainer;
};

export const withContainer = (
  callback: GetServerSideProps
): GetServerSideProps => (context: BeaconsGetServerSidePropsContext) => {
  context.container = context.container || new AppContainer();
  return callback(context);
};
