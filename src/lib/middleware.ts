import { GetServerSidePropsContext } from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { FormCacheFactory, IFormCache } from "./form-cache";
import { v4 as uuidv4 } from "uuid";
import { CookieSerializeOptions, serialize } from "cookie";
import { cookieSessionId } from "./types";
import { ServerResponse } from "http";

export const cookieRedirect = (context: GetServerSidePropsContext): void => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  if (!cookies || !cookies[cookieSessionId]) {
    context.res.writeHead(307, { Location: "/" }).end();
  }
};

export const setCookieSession = (context: GetServerSidePropsContext): void => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  if (!cookies || !cookies[cookieSessionId]) {
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
  const options: CookieSerializeOptions = { path: "/", httpOnly: true };

  res.setHeader("Set-Cookie", serialize(cookieSessionId, id, options));
};
