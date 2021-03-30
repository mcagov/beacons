import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { FormJSON, FormManager } from "./form/formManager";
import { FormSubmission } from "./formCache";
import {
  BeaconsContext,
  decorateGetServerSidePropsContext,
  updateFormCache,
  withCookieRedirect,
} from "./middleware";
import { Registration } from "./registration/registration";
import { formatUrlQueryParams } from "./utils";

type TransformCallback = (formData: FormSubmission) => FormSubmission;

export type DestinationIfValidCallback = (context: BeaconsContext) => string;

export type FormManagerFactory = (formData: FormSubmission) => FormManager;

export interface FormPageProps {
  form: FormJSON;
  showCookieBanner?: boolean;
  flattenedRegistration?: FormSubmission;
}

export const handlePageRequest = (
  destinationIfValid: string,
  formManagerFactory: FormManagerFactory,
  transformCallback: TransformCallback = (formData: FormSubmission) => formData,
  destinationIfValidCallback: DestinationIfValidCallback = () =>
    destinationIfValid
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const beaconsContext: BeaconsContext = await decorateGetServerSidePropsContext(
      context
    );
    const userDidSubmitForm = beaconsContext.req.method === "POST";

    if (userDidSubmitForm) {
      return handlePostRequest(
        beaconsContext,
        formManagerFactory,
        transformCallback,
        destinationIfValidCallback
      );
    }

    return handleGetRequest(beaconsContext, formManagerFactory);
  });

const handleGetRequest = (
  context: BeaconsContext,
  formManagerFactory: FormManagerFactory
): GetServerSidePropsResult<FormPageProps> => {
  const registration: Registration = context.registration;
  const flattenedRegistration = registration.getFlattenedRegistration({
    useIndex: context.useIndex,
  });
  const formManager = formManagerFactory(flattenedRegistration);

  return {
    props: {
      form: formManager.serialise(),
      showCookieBanner: context.showCookieBanner,
      flattenedRegistration,
    },
  };
};

const handlePostRequest = async (
  context: BeaconsContext,
  formManagerFactory: FormManagerFactory,
  transformCallback: TransformCallback = (formData) => formData,
  onSuccessfulFormPostCallback
): Promise<GetServerSidePropsResult<FormPageProps>> => {
  const transformedFormData = transformCallback(context.formData);
  updateFormCache(context.req.cookies, transformedFormData);

  const formManager = formManagerFactory(transformedFormData);
  formManager.markAsDirty();
  const formIsValid = !formManager.hasErrors();

  if (formIsValid) {
    let destination = onSuccessfulFormPostCallback(context);
    destination = formatUrlQueryParams(destination, {
      useIndex: context.useIndex,
    });
    return {
      redirect: {
        statusCode: 303,
        destination,
      },
    };
  }

  const flattenedRegistration = context.registration.getFlattenedRegistration({
    useIndex: context.useIndex,
  });

  return {
    props: {
      form: formManager.serialise(),
      showCookieBanner: context.showCookieBanner,
      flattenedRegistration,
    },
  };
};
