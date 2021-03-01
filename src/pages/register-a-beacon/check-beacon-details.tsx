import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { Details } from "../../components/Details";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { FormInputProps, Input } from "../../components/Input";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { FormControl } from "../../lib/form/formControl";
import { FormGroupControl } from "../../lib/form/formGroupControl";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { handlePageRequest } from "../../lib/handlePageRequest";

interface CheckBeaconDetailsProps {
  formData: CacheEntry;
  needsValidation?: boolean;
}

const getFormGroup = ({
  manufacturer,
  model,
  hexId,
}: CacheEntry): FormGroupControl => {
  return new FormGroupControl({
    manufacturer: new FormControl(manufacturer, [
      Validators.required("Beacon manufacturer is a required field"),
    ]),
    model: new FormControl(model, [
      Validators.required("Beacon model is a required field"),
    ]),
    hexId: new FormControl(hexId, [
      Validators.isLength(
        "Beacon HEX ID or UIN must by 15 characters long",
        15
      ),
      Validators.hexId(
        "Beacon HEX ID or UIN must use numbers 0 to 9 and letters A to F"
      ),
    ]),
  });
};

const CheckBeaconDetails: FunctionComponent<CheckBeaconDetailsProps> = ({
  formData,
  needsValidation = false,
}: CheckBeaconDetailsProps): JSX.Element => {
  const formGroup = getFormGroup(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }
  const controls = formGroup.controls;

  const pageHeading = "Check beacon details";

  return (
    <>
      <Layout
        navigation={<BackButton href="/" />}
        title={pageHeading}
        pageHasErrors={formGroup.hasErrors()}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formGroup={formGroup} />
              <Form action="/register-a-beacon/check-beacon-details">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <InsetText>
                    The details of your beacon must be checked to ensure it is
                    programmed for UK registration.
                  </InsetText>

                  <BeaconManufacturerInput
                    value={controls.manufacturer.value}
                    errorMessages={controls.manufacturer.errorMessages()}
                  />

                  <BeaconModelInput
                    value={controls.model.value}
                    errorMessages={controls.model.errorMessages()}
                  />

                  <BeaconHexIdInput
                    value={controls.hexId.value}
                    errorMessages={controls.hexId.errorMessages()}
                  />
                </FormFieldset>
                <Button buttonText="Continue" />
              </Form>
              <IfYouNeedHelp />
            </>
          }
        />
      </Layout>
    </>
  );
};

const BeaconManufacturerInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="manufacturer"
      label="Enter your beacon manufacturer"
      defaultValue={value}
    />
  </FormGroup>
);

const BeaconModelInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="model" label="Enter your beacon model" defaultValue={value} />
  </FormGroup>
);

const BeaconHexIdInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="hexId"
      label="Enter the 15 character beacon HEX ID or UIN number"
      hintText="This will be on your beacon. It must be 15 characters long and use
      characters 0 to 9 and letters A to F"
      htmlAttributes={{ spellCheck: false }}
      defaultValue={value}
    />
    <Details
      summaryText="What does the 15 character beacon HEX ID or UIN look like?"
      className="govuk-!-padding-top-2"
    >
      TODO: Explain to users how to find their beacon HEX ID
    </Details>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/beacon-information",
  getFormGroup
);

export default CheckBeaconDetails;
