import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { GovUKBody } from "../../components/Typography";
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
import { useRankString } from "../../lib/utils";

const getPageForm = ({ environment }) => {
  return new FormManager({
    environment: new FieldManager(environment, [
      Validators.required("Where the beacon will be used is required"),
    ]),
  });
};

export const BeaconUse: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
  useIndex,
}: FormPageProps): JSX.Element => {
  const pageHeading = `What is the ${useRankString(
    useIndex + 1
  )} use for this beacon?`;
  const pageText = (
    <>
      {useIndex === 0 && (
        <GovUKBody>
          {
            "If you have multiple uses for this beacon, tell us about the main one first."
          }
        </GovUKBody>
      )}
      <GovUKBody>
        {"You will be able to tell us about other uses later in the form"}
      </GovUKBody>
    </>
  );

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
      pageText={pageText}
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
        </RadioList>
      </FormGroup>
    </BeaconsForm>
  );
};

const onSuccessfulFormCallback: DestinationIfValidCallback = (context) => {
  switch (context.formData.environment) {
    case Environment.MARITIME:
    case Environment.AVIATION:
      return PageURLs.purpose;

    default:
      return PageURLs.activity;
  }
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "",
  getPageForm,
  (f) => f,
  onSuccessfulFormCallback
);

export default BeaconUse;
