import { GetServerSidePropsContext } from "next";

export const userDidSubmitForm = (
  context: GetServerSidePropsContext
): boolean => context.req.method === "POST";
