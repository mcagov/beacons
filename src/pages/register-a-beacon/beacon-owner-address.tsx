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
import { FormControl } from "../../lib/form/formControl";
import { FormGroupControl } from "../../lib/form/formGroupControl";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

interface BuildingNumberAndStreetInputProps {
  valueLine1: string;
  valueLine2: string;
  errorMessages: string[];
}

const getFormGroup = ({
  beaconOwnerAddressLine1,
  beaconOwnerAddressLine2,
  beaconOwnerTownOrCity,
  beaconOwnerCounty,
  beaconOwnerPostcode,
}: CacheEntry): FormGroupControl => {
  return new FormGroupControl({
    beaconOwnerAddressLine1: new FormControl(beaconOwnerAddressLine1, [
      Validators.required("Building number and street is a required field"),
    ]),
    beaconOwnerAddressLine2: new FormControl(beaconOwnerAddressLine2),
    beaconOwnerTownOrCity: new FormControl(beaconOwnerTownOrCity, [
      Validators.required("Town or city is a required field"),
    ]),
    beaconOwnerCounty: new FormControl(beaconOwnerCounty),
    beaconOwnerPostcode: new FormControl(beaconOwnerPostcode, [
      Validators.required("Postcode is required"),
    ]),
  });
};

const BeaconOwnerAddressPage: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  const formGroup = getFormGroup(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }
  const controls = formGroup.controls;
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
                <FormErrorSummary formGroup={formGroup} />
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <GovUKBody>
                  The beacon registration certificate and proof of registration
                  labels to stick to the beacon will be sent to this address
                </GovUKBody>
                <BuildingNumberAndStreetInput
                  valueLine1={controls.beaconOwnerAddressLine1.value}
                  valueLine2={controls.beaconOwnerAddressLine2.value}
                  errorMessages={controls.beaconOwnerAddressLine1.errorMessages()}
                />
                <TownOrCityInput
                  value={controls.beaconOwnerTownOrCity.value}
                  errorMessages={controls.beaconOwnerTownOrCity.errorMessages()}
                />
                <CountyInput value={controls.beaconOwnerCounty.value} />
                <PostcodeInput
                  value={controls.beaconOwnerPostcode.value}
                  errorMessages={controls.beaconOwnerPostcode.errorMessages()}
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
  getFormGroup
);

export default BeaconOwnerAddressPage;
