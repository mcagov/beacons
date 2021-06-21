import { Session } from "next-auth";
import { session } from "next-auth/client";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetSessionFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<Session>;

export const getSession =
  (): GetSessionFn => async (context: BeaconsGetServerSidePropsContext) =>
    await session(context);
