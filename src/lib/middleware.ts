import { CookieSerializeOptions, serialize } from "cookie";
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import parse from "urlencoded-body-parser";
import { v4 as uuidv4 } from "uuid";
import { FormCacheFactory, FormSubmission, IFormCache } from "./formCache";
import { Registration } from "./registration/registration";
import { acceptRejectCookieId, formSubmissionCookieId } from "./types";
import { toArray } from "./utils";

export type BeaconsContext = GetServerSidePropsContext & {
  showCookieBanner: boolean;
  submissionId?: string;
  formData: FormSubmission;
  registration?: Registration;
  useIndex: number;
};

export function withCookiePolicy<T>(callback: GetServerSideProps<T>) {
  return async (
    context: BeaconsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies: NextApiRequestCookies = context.req.cookies;

    context.showCookieBanner = !cookies[acceptRejectCookieId];

    return callback(context);
  };
}

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

export const checkHeaderContains = (
  request: IncomingMessage,
  header: keyof IncomingHttpHeaders,
  value: string
): boolean => {
  const headerValues: string[] = toArray(request.headers[header]);
  return (
    headerValues.length > 0 &&
    !!headerValues.find((headerValue) => headerValue.includes(value))
  );
};

const seedCache = async (id: string): Promise<void> => {
  const cache: IFormCache = FormCacheFactory.getCache();
  await cache.update(id);
};

const setCookieHeader = (id: string, res: ServerResponse): void => {
  const options: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  };

  res.setHeader("Set-Cookie", serialize(formSubmissionCookieId, id, options));
};

export async function updateFormCache(
  submissionId: string,
  formData: FormSubmission,
  cache: IFormCache = FormCacheFactory.getCache()
): Promise<void> {
  await cache.update(submissionId, formData);
}

export async function clearFormCache(
  submissionId: string,
  cache: IFormCache = FormCacheFactory.getCache()
): Promise<void> {
  await cache.clear(submissionId);
}

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

export async function parseFormData(
  request: IncomingMessage
): Promise<Record<string, any>> {
  return await parse(request);
}

export async function parseForm<T>(request: IncomingMessage): Promise<T> {
  return (await parseFormData(request)) as T;
}

export const getCache = async (
  id: string,
  cache: IFormCache = FormCacheFactory.getCache()
): Promise<Registration> => {
  return await cache.get(id);
};
