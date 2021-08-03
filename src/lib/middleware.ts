import { CookieSerializeOptions, serialize } from "cookie";
import { IncomingMessage, ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import parse from "urlencoded-body-parser";
import { v4 as uuidv4 } from "uuid";
import { FormCacheFactory, IFormCache } from "./formCache";
import { formSubmissionCookieId } from "./types";

export const setFormSubmissionCookie = async (
  context: GetServerSidePropsContext,
  seedCacheFn: (id: string) => Promise<void> = seedCache
): Promise<void> => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  if (!cookies || !cookies[formSubmissionCookieId]) {
    const id: string = uuidv4();

    await seedCacheFn(id);
    setCookieHeader(id, context.res);
  }
};

const seedCache = async (id: string): Promise<void> => {
  const cache: IFormCache = FormCacheFactory.getCache();
  await cache.update(id);
};

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
