import { GetServerSidePropsContext } from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { formSubmissionCookieId } from "../lib/types";

export interface IVerifySubmissionCookieIsSet {
  execute: (context: GetServerSidePropsContext) => boolean;
}

export class VerifyFormSubmissionCookieIsSet
  implements IVerifySubmissionCookieIsSet {
  public execute(context: GetServerSidePropsContext): boolean {
    const cookies: NextApiRequestCookies = context.req.cookies;
    return !!cookies && !!cookies[formSubmissionCookieId];
  }
}
