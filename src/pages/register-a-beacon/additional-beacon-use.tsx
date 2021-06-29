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
import { AdditionalUses } from "../../lib/registration/types";
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
      <button
        role="button"
        draggable="false"
        className="govuk-button govuk-button--secondary"
        data-module="govuk-button"
        type="submit"
        name={additionalBeaconName}
        value={AdditionalUses.YES}
      >
        Add another use for this beacon
      </button>
    </BeaconsForm>
  );
};

const onSuccessfulFormCallback: DestinationIfValidCallback = async (
  context: BeaconsContext
) => {
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

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "",
  definePageForm,
  (f) => f,
  onSuccessfulFormCallback
);

export default AdditionalBeaconUse;
