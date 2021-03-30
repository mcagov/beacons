import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { BeaconEnvionment } from "../../lib/registration/types";
import { Purpose } from "../../lib/types";

const definePageForm = ({ purpose }: FormSubmission): FormManager => {
  return new FormManager({
    purpose: new FieldManager(purpose, [
      Validators.required("Beacon use purpose is a required field"),
    ]),
  });
};

const PurposePage: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
  flattenedRegistration,
}: FormPageProps): JSX.Element => {
  const environmentChoice =
    flattenedRegistration.environment === BeaconEnvionment.MARITIME
      ? "maritime"
      : "aviation";
  const pageHeading = `Is your ${environmentChoice} use of this beacon mainly for pleasure or commercial reasons?`;
  const beaconUsePurposeFieldName = "purpose";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl="/register-a-beacon/beacon-use"
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <FormGroup errorMessages={form.fields.purpose.errorMessages}>
        <RadioList>
          <RadioListItem
            id="pleasure"
            name={beaconUsePurposeFieldName}
            value={Purpose.PLEASURE}
            label="Personal pleasure"
            defaultChecked={form.fields.purpose.value === Purpose.PLEASURE}
            hintText="Choose this if you mainly use the beacon for leisure, or personal trips. If you hire out pleasure craft choose 'commercial-use' instead"
          />
          <RadioListItem
            id="commerical"
            name={beaconUsePurposeFieldName}
            value={Purpose.COMMERCIAL}
            defaultChecked={form.fields.purpose.value === Purpose.COMMERCIAL}
            label="Commercial use"
            hintText="Choose this if you mainly use the beacon for commercial activities such as Fishing, Merchant vessels, Hire of pleasure craft, Delivery Skipper etc"
          />
        </RadioList>
      </FormGroup>
    </BeaconsForm>
  );
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/activity",
  definePageForm
);

export default PurposePage;
