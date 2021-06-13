import { GetServerSidePropsContext } from "next";
import { formSubmissionCookieId } from "../lib/types";

export type UserFormSubmissionIdFn = (
  context: GetServerSidePropsContext
) => string;

export const retrieveUserFormSubmissionId: UserFormSubmissionIdFn = (context) =>
  context.req.cookies[formSubmissionCookieId];
