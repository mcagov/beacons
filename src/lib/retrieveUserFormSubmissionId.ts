import { GetServerSidePropsContext } from "next";
import { formSubmissionCookieId } from "./types";

export const retrieveUserFormSubmissionId = (
  context: GetServerSidePropsContext
): string => context.req.cookies[formSubmissionCookieId];
