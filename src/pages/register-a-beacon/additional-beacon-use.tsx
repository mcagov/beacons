import { GetServerSideProps } from "next";
import { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import {
  DestinationIfValidCallback,
  FormPageProps,
  handlePageRequest,
} from "../../lib/handlePageRequest";
import { BeaconsContext } from "../../lib/middleware";
import { formatUrlQueryParams } from "../../lib/utils";

const definePageForm = ({
  additionalBeaconUse,
}: FormSubmission): FormManager => {
  return new FormManager({
    additionalBeaconUse: new FieldManager(additionalBeaconUse, [
      Validators.required("Additional beacon use is a required field"),
    ]),
  });
};

const AdditionalBeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}): JSX.Element => {
  const previousPageUrl = "/register-a-beacon/more-details";
  const pageHeading = "Do you have other additional uses for this beacon?";
  const additionalBeaconName = "additionalBeaconUse";

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      previousPageUrl={previousPageUrl}
      formErrors={form.errorSummary}
      showCookieBanner={showCookieBanner}
      errorMessages={form.fields.additionalBeaconUse.errorMessages}
    >
      <RadioList>
        <RadioListItem
          id="yes"
          name={additionalBeaconName}
          value="true"
          label="Yes"
          hintText="We'll ask you to tell us about these in the next step"
        />

        <RadioListItem
          id="no"
          name={additionalBeaconName}
          value="false"
          label="No"
        />
      </RadioList>
    </BeaconsForm>
  );
};

const onSuccessfulFormCallback: DestinationIfValidCallback = (
  context: BeaconsContext
) => {
  const shouldCreateAdditionalUse =
    context.formData.additionalBeaconUse === "true";
  if (shouldCreateAdditionalUse) {
    context.registration.createUse();
    const useIndex = context.useIndex + 1;

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
