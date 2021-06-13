import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { appContainer, IAppContainer } from "./appContainer";

export type BeaconsGetServerSidePropsContext = GetServerSidePropsContext & {
  container: IAppContainer;
};

export const withContainer = (
  callback: GetServerSideProps
): GetServerSideProps => (context: BeaconsGetServerSidePropsContext) => {
  context.container = context.container || appContainer;
  return callback(context);
};
