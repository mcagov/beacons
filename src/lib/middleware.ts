import { CookieSerializeOptions, serialize } from "cookie";
import { IncomingMessage, ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import parse from "urlencoded-body-parser";
import { formSubmissionCookieId } from "./types";

export const setCookieHeader = (id: string, res: ServerResponse): void => {
  const options: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  };

  res.setHeader("Set-Cookie", serialize(formSubmissionCookieId, id, options));
};

export function clearFormSubmissionCookie(
  context: GetServerSidePropsContext
): void {
  const res = context.res;
  const options: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    sameSite: true,
    expires: new Date(0),
  };
  res.setHeader("Set-Cookie", serialize(formSubmissionCookieId, "", options));
}

export async function parseFormDataAs<T>(request: IncomingMessage): Promise<T> {
  return (await parse(request)) as T;
}
