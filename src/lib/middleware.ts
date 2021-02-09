import { GetServerSidePropsContext } from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { BeaconCacheEntry, FormCacheFactory, IFormCache } from "./form-cache";
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

export const setCookieSubmissionId = (
  context: GetServerSidePropsContext
): void => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  if (!cookies || !cookies[formSubmissionCookieId]) {
    const id: string = uuidv4();

    seedCache(id);
    setCookieHeader(id, context.res);
  }
};

const seedCache = (id: string): void => {
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

export async function updateFormCache<T>(
  context: GetServerSidePropsContext
): Promise<T> {
  const formData: T = await parse(context.req);
  const submissionId: string = context.req.cookies[formSubmissionCookieId];

  const state: IFormCache = FormCacheFactory.getCache();
  state.update(submissionId, formData);

  return formData;
}

export const getCache = (
  context: GetServerSidePropsContext
): BeaconCacheEntry => {
  const submissionId: string = context.req.cookies[formSubmissionCookieId];
  const state: IFormCache = FormCacheFactory.getCache();

  return state.get(submissionId);
};
