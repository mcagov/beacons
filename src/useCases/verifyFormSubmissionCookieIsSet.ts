import { GetServerSidePropsContext } from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { formSubmissionCookieId } from "../lib/types";

export interface IVerifyFormSubmissionCookieIsSet {
  execute: (context: GetServerSidePropsContext) => boolean;
}

export class VerifyFormSubmissionCookieIsSet
  implements IVerifyFormSubmissionCookieIsSet {
  public execute(context: GetServerSidePropsContext): boolean {
    const cookies: NextApiRequestCookies = context.req.cookies;
    return !!cookies && !!cookies[formSubmissionCookieId];
  }
}
