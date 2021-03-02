import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { FormInputProps, Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { GovUKBody } from "../../components/Typography";
import { FieldInput } from "../../lib/form/fieldInput";
import { FieldManager } from "../../lib/form/fieldManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

interface BuildingNumberAndStreetInputProps {
  valueLine1: string;
  valueLine2: string;
  errorMessages: string[];
}

const getFieldManager = ({
  beaconOwnerAddressLine1,
  beaconOwnerAddressLine2,
  beaconOwnerTownOrCity,
  beaconOwnerCounty,
  beaconOwnerPostcode,
}: CacheEntry): FieldManager => {
  return new FieldManager({
    beaconOwnerAddressLine1: new FieldInput(beaconOwnerAddressLine1, [
      Validators.required("Building number and street is a required field"),
    ]),
    beaconOwnerAddressLine2: new FieldInput(beaconOwnerAddressLine2),
    beaconOwnerTownOrCity: new FieldInput(beaconOwnerTownOrCity, [
      Validators.required("Town or city is a required field"),
    ]),
    beaconOwnerCounty: new FieldInput(beaconOwnerCounty),
    beaconOwnerPostcode: new FieldInput(beaconOwnerPostcode, [
      Validators.required("Postcode is a required field"),
      Validators.postcode("Postcode must be a valid UK postcode"),
    ]),
  });
};

const BeaconOwnerAddressPage: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  const formGroup = getFieldManager(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }
  const fields = formGroup.fields;
  const pageHeading = "What is the beacon owner's address?";

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/about-beacon-owner" />}
      title={pageHeading}
      pageHasErrors={formGroup.hasErrors()}
    >
      <Grid
        mainContent={
          <>
            <Form action="/register-a-beacon/beacon-owner-address">
              <FormFieldset>
                <FormErrorSummary formErrors={formGroup.errorSummary()} />
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <GovUKBody>
                  The beacon registration certificate and proof of registration
                  labels to stick to the beacon will be sent to this address
                </GovUKBody>
                <BuildingNumberAndStreetInput
                  valueLine1={fields.beaconOwnerAddressLine1.value}
                  valueLine2={fields.beaconOwnerAddressLine2.value}
                  errorMessages={fields.beaconOwnerAddressLine1.errorMessages()}
                />
                <TownOrCityInput
                  value={fields.beaconOwnerTownOrCity.value}
                  errorMessages={fields.beaconOwnerTownOrCity.errorMessages()}
                />
                <CountyInput value={fields.beaconOwnerCounty.value} />
                <PostcodeInput
                  value={fields.beaconOwnerPostcode.value}
                  errorMessages={fields.beaconOwnerPostcode.errorMessages()}
                />
              </FormFieldset>

              <Button buttonText="Continue" />
              <IfYouNeedHelp />
            </Form>
          </>
        }
      />
    </Layout>
  );
};

const BuildingNumberAndStreetInput: FunctionComponent<BuildingNumberAndStreetInputProps> = ({
  valueLine1 = "",
  valueLine2 = "",
  errorMessages,
}: BuildingNumberAndStreetInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="beaconOwnerAddressLine1"
      label="Building number and street"
      defaultValue={valueLine1}
      inputClassName="govuk-!-margin-bottom-2"
    />
    <Input id="beaconOwnerAddressLine2" defaultValue={valueLine2} />
  </FormGroup>
);

const TownOrCityInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="beaconOwnerTownOrCity"
      label="Town or city"
      defaultValue={value}
    />
  </FormGroup>
);

const CountyInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="beaconOwnerCounty"
      label="County (optional)"
      defaultValue={value}
    />
  </FormGroup>
);

const PostcodeInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="beaconOwnerPostcode" label="Postcode" defaultValue={value} />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/emergency-contact",
  getFieldManager
);

export default BeaconOwnerAddressPage;
