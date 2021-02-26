import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { CacheEntry } from "./formCache";
import { FormValidator } from "./formValidator";
import {
  getCache,
  parseFormData,
  updateFormCache,
  withCookieRedirect,
} from "./middleware";
import { acceptRejectCookieId } from "./types";

type TransformFunction = (formData: CacheEntry) => CacheEntry;

export interface FormPageProps {
  formData: CacheEntry;
  needsValidation: boolean;
  showCookieBanner: boolean;
}

export const handlePageRequest = (
  destinationIfValid: string,
  transformFunction: TransformFunction = (formData) => formData
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const userDidSubmitForm = context.req.method === "POST";

    if (userDidSubmitForm) {
      return handlePostRequest(context, destinationIfValid, transformFunction);
    }

    return handleGetRequest(context.req.cookies);
  });

const handleGetRequest = (
  cookies: NextApiRequestCookies
): GetServerSidePropsResult<FormPageProps> => {
  // Accept/Reject cookies state
  const showCookieBanner = !cookies[acceptRejectCookieId];
  return {
    props: {
      formData: getCache(cookies),
      needsValidation: false,
      showCookieBanner: showCookieBanner,
    },
  };
};

export const handlePostRequest = async (
  context: GetServerSidePropsContext,
  destinationIfValid: string,
  transformFunction: TransformFunction = (formData) => formData
): Promise<GetServerSidePropsResult<FormPageProps>> => {
  // Accept/Reject cookies state
  const showCookieBanner = !context.req.cookies[acceptRejectCookieId];
  const transformedFormData = transformFunction(
    await parseFormData(context.req)
  );

  updateFormCache(context.req.cookies, transformedFormData);

  const formIsValid = !FormValidator.hasErrors(transformedFormData);

  if (formIsValid) {
    return {
      redirect: {
        statusCode: 303,
        destination: destinationIfValid,
      },
    };
  }

  return {
    props: {
      formData: transformedFormData,
      needsValidation: true,
      showCookieBanner: showCookieBanner,
    },
  };
};
