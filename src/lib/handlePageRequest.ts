import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { FormManager } from "./form/formManager";
import { CacheEntry } from "./formCache";
import {
  getCache,
  parseFormData,
  updateFormCache,
  withCookieRedirect,
} from "./middleware";

type TransformFunction = (formData: CacheEntry) => CacheEntry;

export type GetFieldManager = (formData: CacheEntry) => FormManager;

export interface FormPageProps {
  formData: CacheEntry;
  needsValidation: boolean;
}

export const handlePageRequest = (
  destinationIfValid: string,
  getFieldManager: GetFieldManager,
  transformFunction: TransformFunction = (formData) => formData
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const userDidSubmitForm = context.req.method === "POST";

    if (userDidSubmitForm) {
      return handlePostRequest(
        context,
        destinationIfValid,
        getFieldManager,
        transformFunction
      );
    }

    return handleGetRequest(context.req.cookies);
  });

const handleGetRequest = (
  cookies: NextApiRequestCookies
): GetServerSidePropsResult<FormPageProps> => {
  return {
    props: {
      formData: getCache(cookies),
      needsValidation: false,
    },
  };
};

export const handlePostRequest = async (
  context: GetServerSidePropsContext,
  destinationIfValid: string,
  getFieldManager: GetFieldManager,
  transformFunction: TransformFunction = (formData) => formData
): Promise<GetServerSidePropsResult<FormPageProps>> => {
  const transformedFormData = transformFunction(
    await parseFormData(context.req)
  );
  updateFormCache(context.req.cookies, transformedFormData);

  const fieldManager = getFieldManager(transformedFormData);
  fieldManager.markAsDirty();
  const formIsValid = !fieldManager.hasErrors();

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
    },
  };
};
