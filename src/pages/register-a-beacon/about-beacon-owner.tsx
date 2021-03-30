import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

const definePageForm = ({
  ownerFullName,
  ownerTelephoneNumber,
  ownerAlternativeTelephoneNumber,
  ownerEmail,
}: FormSubmission): FormManager => {
  return new FormManager({
    ownerFullName: new FieldManager(ownerFullName, [
      Validators.required("Full name is a required field"),
    ]),
    ownerTelephoneNumber: new FieldManager(ownerTelephoneNumber),
    ownerAlternativeTelephoneNumber: new FieldManager(
      ownerAlternativeTelephoneNumber
    ),
    ownerEmail: new FieldManager(ownerEmail, [
      Validators.email("Email address must be valid"),
    ]),
  });
};

const AboutBeaconOwner: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "About the beacon owner";

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      formErrors={form.errorSummary}
      previousPageUrl="/register-a-beacon/more-details"
      showCookieBanner={showCookieBanner}
    >
      <FullName
        value={form.fields.ownerFullName.value}
        errorMessages={form.fields.ownerFullName.errorMessages}
      />

      <TelephoneNumber value={form.fields.ownerTelephoneNumber.value} />

      <AlternativeTelephoneNumber
        value={form.fields.ownerAlternativeTelephoneNumber.value}
      />

      <EmailAddress
        value={form.fields.ownerEmail.value}
        errorMessages={form.fields.ownerEmail.errorMessages}
      />
    </BeaconsForm>
  );
};

const FullName: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="ownerFullName" label="Full name" defaultValue={value} />
  </FormGroup>
);

const TelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="ownerTelephoneNumber"
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
      id="ownerAlternativeTelephoneNumber"
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
      id="ownerEmail"
      label="Email address (optional)"
      hintText="You will receive an email confirming your beacon registration application, including a reference
        number if you need to get in touch with the beacons registry team."
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/beacon-owner-address",
  definePageForm
);

export default AboutBeaconOwner;
