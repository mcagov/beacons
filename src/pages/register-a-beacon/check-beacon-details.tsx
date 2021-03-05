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
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { toUpperCase } from "../../lib/utils";

const definePageForm = ({
  manufacturer,
  model,
  hexId,
}: CacheEntry): FormManager => {
  return new FormManager({
    manufacturer: new FieldManager(manufacturer, [
      Validators.required("Beacon manufacturer is a required field"),
    ]),
    model: new FieldManager(model, [
      Validators.required("Beacon model is a required field"),
    ]),
    hexId: new FieldManager(hexId, [
      Validators.isLength(
        "Beacon HEX ID or UIN must be 15 characters long",
        15
      ),
      Validators.hexId(
        "Beacon HEX ID or UIN must use numbers 0 to 9 and letters A to F"
      ),
    ]),
  });
};

const CheckBeaconDetails: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Check beacon details";

  return (
    <>
      <Layout
        navigation={<BackButton href="/" />}
        title={pageHeading}
        pageHasErrors={form.hasErrors}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={form.errorSummary} />
              <Form action="/register-a-beacon/check-beacon-details">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <InsetText>
                    The details of your beacon must be checked to ensure it is
                    programmed for UK registration.
                  </InsetText>

                  <BeaconManufacturerInput
                    value={form.fields.manufacturer.value}
                    errorMessages={form.fields.manufacturer.errorMessages}
                  />

                  <BeaconModelInput
                    value={form.fields.model.value}
                    errorMessages={form.fields.model.errorMessages}
                  />

                  <BeaconHexIdInput
                    value={form.fields.hexId.value}
                    errorMessages={form.fields.hexId.errorMessages}
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

const transformFormData = (formData: CacheEntry): CacheEntry => {
  formData = { ...formData, hexId: toUpperCase(formData.hexId) };

  return formData;
};

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/beacon-information",
  definePageForm,
  transformFormData
);

export default CheckBeaconDetails;
