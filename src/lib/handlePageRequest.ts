import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { BasicAuthGateway } from "../gateways/basicAuthGateway";
import { AuthenticateUser } from "../useCases/authenticateUser";
import { saveCachedRegistration } from "../useCases/saveCachedRegistration";
import { FormJSON, FormManager } from "./form/formManager";
import { FormSubmission } from "./formCache";
import {
  BeaconsContext,
  decorateGetServerSidePropsContext,
  updateFormCache,
  withCookieRedirect,
} from "./middleware";
import { Registration } from "./registration/registration";
import { IRegistration } from "./registration/types";
import { formatUrlQueryParams } from "./utils";

type TransformCallback = (formData: FormSubmission) => FormSubmission;

export type DestinationIfValidCallback = (
  context: BeaconsContext
) => Promise<string>;

export type FormManagerFactory = (formData: FormSubmission) => FormManager;

export interface FormPageProps {
  form: FormJSON;
  showCookieBanner?: boolean;
  registration?: IRegistration;
  flattenedRegistration?: FormSubmission;
  useIndex?: number;
}

export const handlePageRequest = (
  destinationIfValid: string,
  formManagerFactory: FormManagerFactory,
  transformCallback: TransformCallback = (formData: FormSubmission) => formData,
  destinationIfValidCallback: DestinationIfValidCallback = async () =>
    destinationIfValid
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const authGateway = new BasicAuthGateway();
    const authUseCase = new AuthenticateUser(authGateway);
    await authUseCase.execute(context);

    const beaconsContext: BeaconsContext =
      await decorateGetServerSidePropsContext(context);

    const registration: Registration = beaconsContext.registration;
    const existingUseCount = registration.getRegistration().uses.length;
    const useIndexDoesNotExist = beaconsContext.useIndex > existingUseCount - 1;
    if (useIndexDoesNotExist) {
      registration.createUse();
      saveCachedRegistration(beaconsContext.submissionId, registration);
    }

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
      registration: registration.getRegistration(),
      flattenedRegistration,
      useIndex: context.useIndex,
    },
  };
};

const handlePostRequest = async (
  context: BeaconsContext,
  formManagerFactory: FormManagerFactory,
  transformCallback: TransformCallback = (formData) => formData,
  onSuccessfulFormPostCallback
): Promise<GetServerSidePropsResult<FormPageProps>> => {
  const registration: Registration = context.registration;
  const transformedFormData = transformCallback(context.formData);
  await updateFormCache(context.submissionId, transformedFormData);

  const formManager = formManagerFactory(transformedFormData);
  formManager.markAsDirty();
  const formIsValid = !formManager.hasErrors();

  if (formIsValid) {
    let destination = await onSuccessfulFormPostCallback(context);
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
      registration: registration.getRegistration(),
      flattenedRegistration,
    },
  };
};
