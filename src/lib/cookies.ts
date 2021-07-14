import { GetServerSidePropsContext } from "next";
import { acceptRejectCookieId, formSubmissionCookieId } from "./types";

export const verifyFormSubmissionCookieIsSet = (
  context: GetServerSidePropsContext
): boolean =>
  !!context.req.cookies && !!context.req.cookies[formSubmissionCookieId];

export const userHasAcceptedCookies = (
  context: GetServerSidePropsContext
): boolean =>
  !!context.req.cookies && !!context.req.cookies[acceptRejectCookieId];
