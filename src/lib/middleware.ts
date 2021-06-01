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

export function withCookieRedirect<T>(callback: GetServerSideProps<T>) {
  return async (
    context: BeaconsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const cookies: NextApiRequestCookies = context.req.cookies;

    if (!cookies || !cookies[formSubmissionCookieId]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return callback(context);
  };
}

/**
 * Decorator function to add beacons specific information to the `getServerSideProps` context.
 *
 * @param context {GetServerSidePropsContext}   The NextJS application context
 * @returns       {Promise<BeaconsContext>}     A promise resolving to the decorated context containing application specific data
 */
export async function decorateGetServerSidePropsContext(
  context: GetServerSidePropsContext
): Promise<BeaconsContext> {
  const decoratedContext: BeaconsContext = context as BeaconsContext;

  addCookieBannerAcceptance(decoratedContext);
  await addCache(decoratedContext);
  await addFormData(decoratedContext);
  addRegistrationIndexes(decoratedContext);

  return decoratedContext;
}

function addCookieBannerAcceptance(context: BeaconsContext): void {
  const showCookieBanner = !context.req.cookies[acceptRejectCookieId];
  context.showCookieBanner = showCookieBanner;
}

async function addCache(context: BeaconsContext): Promise<void> {
  const submissionId: string = context.req.cookies[formSubmissionCookieId];
  const registration: Registration = await (async () =>
    getCache(submissionId))();

  context.submissionId = submissionId;
  context.registration = registration;
}

async function addFormData(context: BeaconsContext): Promise<void> {
  const formData = await parseFormData(context.req);
  context.formData = formData;
}

function addRegistrationIndexes(context: BeaconsContext): void {
  const useIndex = parseInt(context.query.useIndex as string) || 0;
  context.useIndex = useIndex;
}

export const setFormSubmissionCookie = async (
  context: GetServerSidePropsContext
): Promise<void> => {
  const cookies: NextApiRequestCookies = context.req.cookies;

  if (!cookies || !cookies[formSubmissionCookieId]) {
    const id: string = uuidv4();

    await seedCache(id);
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
    sameSite: true,
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

export async function setFormCache(
  submissionId: string,
  registration: Registration,
  cache: IFormCache = FormCacheFactory.getCache()
): Promise<void> {
  await cache.set(submissionId, registration);
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

export const getCache = async (
  id: string,
  cache: IFormCache = FormCacheFactory.getCache()
): Promise<Registration> => {
  return await cache.get(id);
};
