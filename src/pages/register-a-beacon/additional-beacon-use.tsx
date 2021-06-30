import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { BeaconUseSection } from "../../components/Domain/BeaconUseSection";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormCacheFactory, FormSubmission } from "../../lib/formCache";
import {
  DestinationIfValidCallback,
  FormPageProps,
  handlePageRequest,
} from "../../lib/handlePageRequest";
import {
  BeaconsContext,
  decorateGetServerSidePropsContext,
  setFormCache,
} from "../../lib/middleware";
import { AdditionalUses } from "../../lib/registration/types";
import { formatUrlQueryParams } from "../../lib/utils";

const definePageForm = ({}: FormSubmission): FormManager => {
  return new FormManager({
    additionalBeaconUse: new FieldManager("mainUse", [
      Validators.required("Additional beacon use is a required field"),
    ]),
  });
};

const AdditionalBeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  registration,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const previousPageUrl = "/register-a-beacon/more-details";
  const pageHeading = "Summary of how you use this beacon";
  const additionalBeaconName = "additionalBeaconUse";

  const useSections = [];
  for (const [index, use] of registration.uses.entries()) {
    useSections.push(
      <BeaconUseSection index={index} use={use} key={`row${index}`} />
    );
  }

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      previousPageUrl={previousPageUrl}
      formErrors={form.errorSummary}
      showCookieBanner={showCookieBanner}
      errorMessages={form.fields.additionalBeaconUse.errorMessages}
    >
      {useSections}

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
  async (context: GetServerSidePropsContext) => {
    const decoratedContext = await decorateGetServerSidePropsContext(context);

    return {
      props: { registration: decoratedContext.registration.registration },
    };
  },
  onSuccessfulFormCallback
);

export default AdditionalBeaconUse;
