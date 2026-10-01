import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { getAppContainer } from "../appContainer";
import { BeaconsGetServerSidePropsContext } from "./BeaconsGetServerSidePropsContext";

export const withContainer =
  (callback: GetServerSideProps): GetServerSideProps =>
  async (context: BeaconsGetServerSidePropsContext) => {
    if (!context.container) {
      context.session = context.session || (await getSession(context));
      context.container = getAppContainer({
        authId: context.session?.user?.authId,
      });
    }

    return callback(context);
  };
