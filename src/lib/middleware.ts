import { GetServerSidePropsContext } from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { FormCacheFactory, IFormCache } from "./form-cache";
import { v4 as uuidv4 } from "uuid";
import { CookieSerializeOptions, serialize } from "cookie";
import { formSubmissionCookieId } from "./types";
import { ServerResponse } from "http";
import parse from "urlencoded-body-parser";

export const cookieRedirect = (context: GetServerSidePropsContext): void => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  if (!cookies || !cookies[formSubmissionCookieId]) {
    context.res.writeHead(307, { Location: "/" }).end();
  }
};

export async function updateFormCache<T>(
  context: GetServerSidePropsContext
): Promise<T> {
  const previousFormPageData: T = await parse(context.req);
  const submissionId: string = getSubmissionCookieId(context);

  const state: IFormCache = FormCacheFactory.getCache();
  state.update(submissionId, previousFormPageData);

  return previousFormPageData;
}

const getSubmissionCookieId = (context: GetServerSidePropsContext): string => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  return cookies && cookies[formSubmissionCookieId]
    ? cookies[formSubmissionCookieId]
    : null;
};

export const setCookieSubmissionId = (
  context: GetServerSidePropsContext
): void => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  if (!cookies || !cookies[formSubmissionCookieId]) {
    const id: string = uuidv4();

    updateCache(id);
    setCookieHeader(id, context.res);
  }
};

const updateCache = (id: string): void => {
  const cache: IFormCache = FormCacheFactory.getCache();
  cache.update(id);
};

const setCookieHeader = (id: string, res: ServerResponse): void => {
  const options: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    sameSite: true,
  };

  res.setHeader("Set-Cookie", serialize(formSubmissionCookieId, id, options));
};
