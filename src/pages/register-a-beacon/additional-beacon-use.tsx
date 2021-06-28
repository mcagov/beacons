import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { FormCacheFactory, FormSubmission } from "../../lib/formCache";
import {
  DestinationIfValidCallback,
  FormPageProps,
  handlePageRequest,
} from "../../lib/handlePageRequest";
import { BeaconsContext, setFormCache } from "../../lib/middleware";
import { formatUrlQueryParams } from "../../lib/utils";

const definePageForm = ({
  additionalBeaconUse,
}: FormSubmission): FormManager => {
  return new FormManager({
    additionalBeaconUse: new FieldManager(additionalBeaconUse, [
      //Validators.required("Additional beacon use is a required field"),
    ]),
  });
};

const AdditionalBeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const previousPageUrl = "/register-a-beacon/more-details";
  const pageHeading = "Summary of how you use this beacon";
  const additionalBeaconName = "additionalBeaconUse";

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      previousPageUrl={previousPageUrl}
      formErrors={form.errorSummary}
      showCookieBanner={showCookieBanner}
      errorMessages={form.fields.additionalBeaconUse.errorMessages}
    >
      <RegisterAnotherUseForThisBeacon></RegisterAnotherUseForThisBeacon>
    </BeaconsForm>
  );
};

const onSuccessfulFormCallback: DestinationIfValidCallback = async (
  context: BeaconsContext
) => {
  console.log(context.formData);
  const shouldCreateAdditionalUse =
    context.formData.additionalBeaconUse === "true";
  if (shouldCreateAdditionalUse) {
    const registration = await FormCacheFactory.getCache().get(
      context.submissionId
    );
    registration.createUse();
    await setFormCache(context.submissionId, registration);

    const useIndex = registration.getRegistration().uses.length - 1;

    return formatUrlQueryParams("/register-a-beacon/beacon-use", { useIndex });
  } else {
    return "/register-a-beacon/about-beacon-owner";
  }
};

const RegisterAnotherUseForThisBeacon: FunctionComponent = (): JSX.Element => (
  <>
    <button
      role="button"
      draggable="false"
      className="govuk-button govuk-button--secondary"
      data-module="govuk-button"
      type="submit"
      name="additionalBeaconUse"
      value="true"
    >
      Add another use for this beacon
    </button>
  </>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "",
  definePageForm,
  (f) => f,
  onSuccessfulFormCallback
);

export default AdditionalBeaconUse;
