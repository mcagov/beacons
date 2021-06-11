import { GetServerSidePropsContext } from "next";
import { formSubmissionCookieId } from "../lib/types";

export type RetrieveUserFormSubmissionIdFn = (
  context: GetServerSidePropsContext
) => string;

export const retrieveUserFormSubmissionId: RetrieveUserFormSubmissionIdFn = (
  context
) => context.req.cookies[formSubmissionCookieId];
