import { GetServerSidePropsContext } from "next";
import { formSubmissionCookieId } from "../lib/types";

export type VerifyFormSubmissionCookieIsSetFn = (
  context: GetServerSidePropsContext
) => boolean;

export const verifyFormSubmissionCookieIsSet: VerifyFormSubmissionCookieIsSetFn = (
  context
) => !!context.req.cookies && !!context.req.cookies[formSubmissionCookieId];
