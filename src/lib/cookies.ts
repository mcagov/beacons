import { GetServerSidePropsContext } from "next";
import { acceptRejectCookieId, formSubmissionCookieId } from "./types";

export const verifyFormSubmissionCookieIsSet = (
  context: GetServerSidePropsContext
): boolean =>
  !!context.req.cookies && !!context.req.cookies[formSubmissionCookieId];

export const userHasHiddenCookieBanner = (
  context: GetServerSidePropsContext
): boolean =>
  !!context.req.cookies && !!context.req.cookies[acceptRejectCookieId];

export const showCookieBanner = (context: GetServerSidePropsContext): boolean =>
  !userHasHiddenCookieBanner(context);
