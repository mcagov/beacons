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

type TransformCallback = (formData: CacheEntry) => CacheEntry;

export type DefineFormRulesCallback = (formData: CacheEntry) => FormManager;

export interface FormPageProps {
  form: FormJSON;
}

export const handlePageRequest = (
  destinationIfValid: string,
  defineFormRulesCallback: DefineFormRulesCallback,
  transformCallback: TransformCallback = (formData) => formData
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const userDidSubmitForm = context.req.method === "POST";

    if (userDidSubmitForm) {
      return handlePostRequest(
        context,
        destinationIfValid,
        defineFormRulesCallback,
        transformCallback
      );
    }

    return handleGetRequest(context.req.cookies, defineFormRulesCallback);
  });

const handleGetRequest = (
  cookies: NextApiRequestCookies,
  defineFormRulesCallback: DefineFormRulesCallback
): GetServerSidePropsResult<FormPageProps> => {
  const formManager = defineFormRulesCallback(getCache(cookies));

  return {
    props: {
      form: formManager.serialise(),
    },
  };
};

export const handlePostRequest = async (
  context: GetServerSidePropsContext,
  destinationIfValid: string,
  defineFormRulesCallback: DefineFormRulesCallback,
  transformCallback: TransformCallback = (formData) => formData
): Promise<GetServerSidePropsResult<FormPageProps>> => {
  const transformedFormData = transformCallback(
    await parseFormData(context.req)
  );
  updateFormCache(context.req.cookies, transformedFormData);

  const formManager = defineFormRulesCallback(transformedFormData);
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
      form: formManager.serialise(),
    },
  };
};
