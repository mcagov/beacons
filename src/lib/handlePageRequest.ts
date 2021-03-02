import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import { FormJSON, FormManager } from "./form/formManager";
import { CacheEntry } from "./formCache";
import {
  getCache,
  parseFormData,
  updateFormCache,
  withCookieRedirect,
} from "./middleware";

type TransformFunction = (formData: CacheEntry) => CacheEntry;

export type GetFormManager = (formData: CacheEntry) => FormManager;

export interface FormPageProps {
  formJSON: FormJSON;
}

export const handlePageRequest = (
  destinationIfValid: string,
  getFormManager: GetFormManager,
  transformFunction: TransformFunction = (formData) => formData
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const userDidSubmitForm = context.req.method === "POST";

    if (userDidSubmitForm) {
      return handlePostRequest(
        context,
        destinationIfValid,
        getFormManager,
        transformFunction
      );
    }

    return handleGetRequest(context.req.cookies, getFormManager);
  });

const handleGetRequest = (
  cookies: NextApiRequestCookies,
  getFormManager: GetFormManager
): GetServerSidePropsResult<FormPageProps> => {
  const formManager = getFormManager(getCache(cookies));

  return {
    props: {
      formJSON: formManager.serialise(),
    },
  };
};

export const handlePostRequest = async (
  context: GetServerSidePropsContext,
  destinationIfValid: string,
  getFormManager: GetFormManager,
  transformFunction: TransformFunction = (formData) => formData
): Promise<GetServerSidePropsResult<FormPageProps>> => {
  const transformedFormData = transformFunction(
    await parseFormData(context.req)
  );
  updateFormCache(context.req.cookies, transformedFormData);

  const formManager = getFormManager(transformedFormData);
  formManager.markAsDirty();
  const formIsValid = !formManager.hasErrors();

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
      formJSON: formManager.serialise(),
    },
  };
};
