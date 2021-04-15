import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { Input } from "../../components/Input";
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
import { PageURLs } from "../../lib/urls";

const getPageForm = ({ environment, environmentOtherInput }) => {
  return new FormManager({
    environment: new FieldManager(environment, [
      Validators.required("Where the beacon will be used is required"),
    ]),
    environmentOtherInput: new FieldManager(
      environmentOtherInput,
      [
        Validators.required(
          "We need to know where this beacon will be used in if you have selected other use"
        ),
      ],
      [
        {
          dependsOn: "environment",
          meetingCondition: (value) => value === Environment.OTHER,
        },
      ]
    ),
  });
};

const BeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
  useIndex,
}: FormPageProps): JSX.Element => {
  const pageHeading = "What is the primary use for this beacon?";

  const environmentFieldName = "environment";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={
        useIndex === 0
          ? PageURLs.beaconInformation
          : PageURLs.additionalUse + `?useIndex=${useIndex - 1}`
      }
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      insetText="If you have multiple uses for this beacon, tell us about the
    main one first. You will be able to tell us about other uses
    later in the form"
    >
      <FormGroup errorMessages={form.fields.environment.errorMessages}>
        <RadioList conditional={true}>
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
            conditional={true}
          >
            <FormGroup
              errorMessages={form.fields.environmentOtherInput.errorMessages}
            >
              <Input
                id="environmentOtherInput"
                label="Please describe your use"
                defaultValue={form.fields.environmentOtherInput.value}
              />
            </FormGroup>
          </RadioListItem>
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
      return "/register-a-beacon/land-other-activity";
  }
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "",
  getPageForm,
  (f) => f,
  onSuccessfulFormCallback
);

export default BeaconUse;
