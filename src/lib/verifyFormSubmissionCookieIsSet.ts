import { GetServerSidePropsContext } from "next";
import { formSubmissionCookieId } from "./types";

export const verifyFormSubmissionCookieIsSet = (
  context: GetServerSidePropsContext
): boolean =>
  !!context.req.cookies && !!context.req.cookies[formSubmissionCookieId];
