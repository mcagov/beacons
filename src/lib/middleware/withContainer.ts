import { GetServerSideProps } from "next";
import { appContainer } from "../appContainer";
import { BeaconsGetServerSidePropsContext } from "./BeaconsGetServerSidePropsContext";

export const withContainer =
  (callback: GetServerSideProps): GetServerSideProps =>
  (context: BeaconsGetServerSidePropsContext) => {
    context.container = context.container || appContainer;
    return callback(context);
  };
