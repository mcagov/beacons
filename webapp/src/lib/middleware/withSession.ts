import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { BeaconsGetServerSidePropsContext } from "./BeaconsGetServerSidePropsContext";

export const withSession =
  (callback: GetServerSideProps): GetServerSideProps =>
  async (context: BeaconsGetServerSidePropsContext) => {
    context.session = context.session || (await getSession(context));

    return callback(context);
  };
