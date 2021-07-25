import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { Details } from "../../components/Details";
import { FormGroup } from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormPageProps } from "../../lib/handlePageRequest";
import { withCookiePolicy } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { PageURLs } from "../../lib/urls";
import { toUpperCase } from "../../lib/writingStyle";
import { BeaconsPageRouter } from "../../pageHandler/BeaconsPageRouter";
import { UserRequestedToViewFormRule } from "../../pageHandler/rules/UserRequestedToViewFormRule";
import { UserSubmittedInvalidFormRule } from "../../pageHandler/rules/UserSubmittedInvalidFormRule";
import { UserSubmittedValidFormRule } from "../../pageHandler/rules/UserSubmittedValidFormRule";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";

interface CheckBeaconDetailsForm {
  manufacturer: string;
  model: string;
  hexId: string;
}

const CheckBeaconDetails: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "Check beacon details";
  const pageText =
    "The details of your beacon must be checked to ensure it is programmed for UK registration.";

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl="/"
      includeUseIndex={false}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      pageText={pageText}
    >
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
    </BeaconsForm>
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
      <Image
        src="/assets/mca_images/beacon_hex_id.png"
        alt="Where to find your beacon's hexadecimal ID or UIN"
        height={640}
        width={960}
      />
    </Details>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withCookiePolicy(
  withContainer(
    withSession(async (context: BeaconsGetServerSidePropsContext) => {
      const nextPageUrl = PageURLs.beaconInformation;

      return await new BeaconsPageRouter([
        new UserRequestedToViewFormRule(
          context,
          formValidationRules,
          formToDraftRegistrationMapper
        ),
        new UserSubmittedInvalidFormRule(
          context,
          formValidationRules,
          formToDraftRegistrationMapper
        ),
        new UserSubmittedValidFormRule(
          context,
          formValidationRules,
          formToDraftRegistrationMapper,
          nextPageUrl
        ),
      ]).execute();
    })
  )
);

const formToDraftRegistrationMapper: RegistrationFormMapper<CheckBeaconDetailsForm> =
  {
    toDraftRegistration: (form) => ({
      manufacturer: form.manufacturer,
      model: form.model,
      hexId: toUpperCase(form.hexId),
    }),
    toForm: (draftRegistration) => ({
      manufacturer: draftRegistration?.manufacturer || "",
      model: draftRegistration?.model || "",
      hexId: draftRegistration?.hexId || "",
    }),
  };

const formValidationRules = ({
  manufacturer,
  model,
  hexId,
}: CheckBeaconDetailsForm): FormManager => {
  return new FormManager({
    manufacturer: new FieldManager(manufacturer, [
      Validators.required("Beacon manufacturer is a required field"),
    ]),
    model: new FieldManager(model, [
      Validators.required("Beacon model is a required field"),
    ]),
    hexId: new FieldManager(hexId, [
      Validators.required("Beacon HEX ID is a required field"),
      Validators.isLength(
        "Beacon HEX ID or UIN must be 15 characters long",
        15
      ),
      Validators.hexadecimalString(
        "Beacon HEX ID or UIN must use numbers 0 to 9 and letters A to F"
      ),
      Validators.ukEncodedBeacon(
        "You entered a beacon encoded with a Hex ID from %HEX_ID_COUNTRY%.  Your beacon must be UK-encoded to use this service."
      ),
      Validators.shouldNotContain(
        'Your HEX ID should not contain the letter "O".  Did you mean the number zero?',
        "O"
      ),
    ]),
  });
};

export default CheckBeaconDetails;
