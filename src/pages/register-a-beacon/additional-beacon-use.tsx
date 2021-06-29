import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { SummaryList, SummaryListItem } from "../../components/SummaryList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
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
import { AdditionalUses, BeaconUse } from "../../lib/registration/types";
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
  registration,
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
      <BeaconUseRow beaconUse={registration.uses[0]} />

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

interface IBeaconUseProps {
  beaconUse: BeaconUse;
}

const BeaconUseRow: FunctionComponent<IBeaconUseProps> = ({
  beaconUse: { maxCapacity, otherCommunicationInput, moreDetails },
}: IBeaconUseProps): JSX.Element => (
  <>
    <SummaryList>
      <SummaryListItem labelText="Additional beacon information">
        <p>{maxCapacity}</p>
      </SummaryListItem>
      <SummaryListItem labelText="Communications">
        <p>{otherCommunicationInput}</p>
      </SummaryListItem>
      <SummaryListItem labelText="More details">
        <p>{moreDetails}</p>
      </SummaryListItem>
    </SummaryList>
  </>
);

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
