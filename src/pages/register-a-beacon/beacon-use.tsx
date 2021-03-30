import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import {
  DestinationIfValidCallback,
  FormPageProps,
  handlePageRequest,
} from "../../lib/handlePageRequest";
import { Environment } from "../../lib/registration/types";

const getPageForm = ({ environment }) => {
  return new FormManager({
    environment: new FieldManager(environment, [
      Validators.required(
        "Which enviornment the beacon will be used is required"
      ),
    ]),
  });
};

const BeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "What is the primary use for this beacon?";

  const environmentFieldName = "environment";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl="/register-a-beacon/beacon-information"
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      insetText="If you have multiple uses for this beacon, tell us about the
    main one first. You will be able to tell us about other uses
    later in the form"
    >
      <FormGroup errorMessages={form.fields.environment.errorMessages}>
        <RadioList>
          <RadioListItem
            id="maritime"
            name={environmentFieldName}
            label="Maritime"
            hintText="This might include commercial or pleasure sailing / motor vessels or unpowered craft. It could also include sea-based windfarms and rigs/platforms."
            value={Environment.MARITIME}
            defaultChecked={
              form.fields.environment.value === Environment.MARITIME
            }
          />

          <RadioListItem
            id="aviation"
            name={environmentFieldName}
            label="Aviation"
            hintText="This might include commercial or pleasure aircraft"
            value={Environment.AVIATION}
            defaultChecked={
              form.fields.environment.value === Environment.AVIATION
            }
          />

          <RadioListItem
            id="land"
            name={environmentFieldName}
            label="Land-based"
            hintText="This could include vehicle or other overland uses. It could also include land-based windfarms."
            value={Environment.LAND}
            defaultChecked={form.fields.environment.value === Environment.LAND}
          />

          <RadioListItem
            id="other"
            name={environmentFieldName}
            label="Other"
            value={Environment.OTHER}
            defaultChecked={form.fields.environment.value === Environment.OTHER}
          />
        </RadioList>
      </FormGroup>
    </BeaconsForm>
  );
};

const onSuccessfulFormCallback: DestinationIfValidCallback = (context) => {
  switch (context.formData.environment) {
    case Environment.MARITIME:
    case Environment.AVIATION:
      return "/register-a-beacon/purpose";

    default:
      return "/register-a-beacon/activity";
  }
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "",
  getPageForm,
  (f) => f,
  onSuccessfulFormCallback
);

export default BeaconUse;
