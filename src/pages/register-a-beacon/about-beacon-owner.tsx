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
import { FieldInput } from "../../lib/form/fieldInput";
import { FieldManager } from "../../lib/form/fieldManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

const getFormGroup = ({
  beaconOwnerFullName,
  beaconOwnerTelephoneNumber,
  beaconOwnerAlternativeTelephoneNumber,
  beaconOwnerEmail,
}: CacheEntry): FieldManager => {
  return new FieldManager({
    beaconOwnerFullName: new FieldInput(beaconOwnerFullName, [
      Validators.required("Full name is a required field"),
    ]),
    beaconOwnerTelephoneNumber: new FieldInput(beaconOwnerTelephoneNumber),
    beaconOwnerAlternativeTelephoneNumber: new FieldInput(
      beaconOwnerAlternativeTelephoneNumber
    ),
    beaconOwnerEmail: new FieldInput(beaconOwnerEmail, [
      Validators.email("Email address must be valid"),
    ]),
  });
};

const AboutBeaconOwner: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  const formGroup = getFormGroup(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }
  const controls = formGroup.controls;
  const pageHeading = "About the beacon owner";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/more-vessel-details" />
        }
        title={pageHeading}
        pageHasErrors={formGroup.hasErrors()}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/about-beacon-owner">
                <FormFieldset>
                  <FormErrorSummary formErrors={formGroup.errorSummary()} />
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <FullName
                    value={controls.beaconOwnerFullName.value}
                    errorMessages={controls.beaconOwnerFullName.errorMessages()}
                  />

                  <TelephoneNumber
                    value={controls.beaconOwnerTelephoneNumber.value}
                  />

                  <AlternativeTelephoneNumber
                    value={formData.beaconOwnerAlternativeTelephoneNumber}
                  />

                  <EmailAddress
                    value={controls.beaconOwnerEmail.value}
                    errorMessages={controls.beaconOwnerEmail.errorMessages()}
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

const FullName: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="beaconOwnerFullName" label="Full name" defaultValue={value} />
  </FormGroup>
);

const TelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="beaconOwnerTelephoneNumber"
      label="Telephone number (optional)"
      hintText="This can be a mobile or landline. For international numbers include the country code."
      defaultValue={value}
    />
  </FormGroup>
);

const AlternativeTelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="beaconOwnerAlternativeTelephoneNumber"
      label="Additional telephone number (optional)"
      hintText="This can be a mobile or landline. For international numbers include the country code."
      defaultValue={value}
    />
  </FormGroup>
);

const EmailAddress: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="beaconOwnerEmail"
      label="Email address (optional)"
      hintText="You will receive an email confirming your beacon registration application, including a reference
        number if you need to get in touch with the beacons registry team."
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/beacon-owner-address",
  getFormGroup
);

export default AboutBeaconOwner;
