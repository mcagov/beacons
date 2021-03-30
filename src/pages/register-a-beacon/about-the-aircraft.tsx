import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormHint,
  FormLegend,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { FormInputProps, Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { TextareaCharacterCount } from "../../components/Textarea";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

const definePageForm = ({
  maxCapacity,
  aircraftManufacturer,
  principalAirport,
  secondaryAirport,
  registrationMark,
  hexAddress,
  cnOrMsnNumber,
  dongle,
  beaconPosition,
}: FormSubmission): FormManager => {
  return new FormManager({
    maxCapacity: new FieldManager(maxCapacity, [
      Validators.required(
        "Maximum number of persons onboard is a required field"
      ),
      Validators.wholeNumber(
        "Maximum number of persons onboard must be a whole number"
      ),
    ]),
    aircraftManufacturer: new FieldManager(aircraftManufacturer),
    principalAirport: new FieldManager(principalAirport),
    secondaryAirport: new FieldManager(secondaryAirport),
    registrationMark: new FieldManager(registrationMark),
    hexAddress: new FieldManager(hexAddress),
    cnOrMsnNumber: new FieldManager(cnOrMsnNumber),
    dongle: new FieldManager(dongle),
    beaconPosition: new FieldManager(beaconPosition, [
      Validators.maxLength(
        "Where the beacon will be positioned has too many characters",
        100
      ),
    ]),
  });
};

const AboutTheAircraft: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "About the aircraft";

  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/activity" />}
        title={pageHeading}
        pageHasErrors={form.hasErrors}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={form.errorSummary} />
              <Form action="/register-a-beacon/about-the-aircraft">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <MaxCapacityInput
                    value={form.fields.maxCapacity.value}
                    errorMessages={form.fields.maxCapacity.errorMessages}
                  />

                  <Manufacturer
                    value={form.fields.aircraftManufacturer.value}
                  />

                  <PrincipalAirport
                    value={form.fields.principalAirport.value}
                  />

                  <SecondaryAirport
                    value={form.fields.secondaryAirport.value}
                  />

                  <RegistrationMark
                    value={form.fields.registrationMark.value}
                  />

                  <HexAddress value={form.fields.hexAddress.value} />

                  <CoreNumberOrManufacturerSerialNumber
                    value={form.fields.cnOrMsnNumber.value}
                  />

                  <Dongle value={form.fields.dongle.value} />

                  <BeaconPosition
                    value={form.fields.beaconPosition.value}
                    errorMessages={form.fields.beaconPosition.errorMessages}
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

const MaxCapacityInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="maxCapacity"
      label="Enter the maximum number of persons onboard"
      hintText="Knowing the maximum number of persons likely to be onboard the aircraft helps Search and Rescue know how many people to look for and what resources to send"
      defaultValue={value}
      numOfChars={5}
      htmlAttributes={{
        pattern: "[0-9]*",
        inputMode: "numeric",
      }}
    />
  </FormGroup>
);

const Manufacturer: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="aircraftManufacturer"
      label="Aircraft manufacturer and model/type (optional)"
      hintText="E.g. Cessna 162 Skycatcher"
      defaultValue={value}
    />
  </FormGroup>
);

const PrincipalAirport: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="principalAirport"
      label="Principal airport or airfield (optional)"
      hintText="E.g. Bristol International Airport"
      defaultValue={value}
    />
  </FormGroup>
);

const SecondaryAirport: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="secondaryAirport"
      label="Secondary airport or airfield (optional)"
      hintText="E.g. Bristol International Airport"
      defaultValue={value}
    />
  </FormGroup>
);

const RegistrationMark: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="registrationMark"
      label="Enter the Aircraft Registration Mark (optional)"
      hintText="This is usually found on the rear fuselage or tail E.g. G-AAAA"
      defaultValue={value}
    />
  </FormGroup>
);

const HexAddress: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="hexAddress"
      label="Enter the Aircraft 24-bit HEXADECIMAL address (optional)"
      hintText="The 24-bit address is used to provide a unique identity normally allocated to an individual aircraft or registration. E.g. AC82EC"
      defaultValue={value}
    />
  </FormGroup>
);

const CoreNumberOrManufacturerSerialNumber: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="cnOrMsnNumber"
      label="Enter the Aircraft CORE Number (CN) or Manufacturers Serial Number (MSN) (optional)"
      hintText="These help Search and Rescue positively identify aircraft if it changes aircraft registration e.g. G-WXYZ becomes M-ZYXW"
      defaultValue={value}
    />
  </FormGroup>
);

const Dongle: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <FormFieldset>
      <FormLegend>Types of communication devices onboard</FormLegend>
      <FormHint forId="typesOfCommunication">
        A dongle is a small USB stick beacon that can be moved between different
        aircraft. Knowing if it might used on a different aircraft will help
        Search and Rescue in an emergency
      </FormHint>
      <RadioList small={true}>
        <RadioListItem
          id="dongle-no"
          name="dongle"
          value="false"
          label="no"
          defaultChecked={value === "false"}
        />
        <RadioListItem
          id="dongle-yes"
          name="dongle"
          value="true"
          label="yes"
          defaultChecked={value === "true"}
        />
      </RadioList>
    </FormFieldset>
  </FormGroup>
);

const BeaconPosition: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps) => (
  <TextareaCharacterCount
    id="beaconPosition"
    errorMessages={errorMessages}
    label="Tell us where this beacon will be positioned (optional)"
    hintText="E.g. will the beacon be attached to the pilot, stowed inside the nose of the aircraft, in the tail etc?"
    maxCharacters={100}
    defaultValue={value}
  />
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/aircraft-communications",
  definePageForm
);

export default AboutTheAircraft;
