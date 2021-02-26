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
import { TextareaCharacterCount } from "../../components/Textarea";
import { FormControl } from "../../lib/form/formControl";
import { FormGroupControl } from "../../lib/form/formGroupControl";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { handlePageRequest } from "../../lib/handlePageRequest";

interface AboutTheVesselProps {
  formData: CacheEntry;
  needsValidation?: boolean;
}

const getFormGroup = ({
  maxCapacity,
  vesselName,
  homeport,
  areaOfOperation,
  beaconLocation,
}: CacheEntry): FormGroupControl => {
  return new FormGroupControl({
    maxCapacity: new FormControl(maxCapacity, [
      Validators.required("Manufacturer is a required field"),
    ]),
    vesselName: new FormControl(vesselName),
    homeport: new FormControl(homeport),
    areaOfOperation: new FormControl(areaOfOperation, [
      Validators.max("Typical area of operation has too many characters", 250),
    ]),
    beaconLocation: new FormControl(beaconLocation, [
      Validators.max("Where the beacon is kept has too many characters", 250),
    ]),
  });
};

const AboutTheVessel: FunctionComponent<AboutTheVesselProps> = ({
  formData,
  needsValidation = false,
}: AboutTheVesselProps): JSX.Element => {
  const formGroup = getFormGroup(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }
  const controls = formGroup.controls;

  const pageHeading = "About the pleasure vessel";

  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/primary-beacon-use" />}
        title={pageHeading}
        pageHasErrors={formGroup.hasErrors()}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formGroup={formGroup} />
              <Form action="/register-a-beacon/about-the-vessel">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <MaxCapacityInput
                    value={controls.maxCapacity.value}
                    errorMessages={controls.maxCapacity.errorMessages()}
                  />

                  <VesselNameInput value={controls.vesselName.value} />

                  <HomeportInput value={controls.homeport.value} />

                  <AreaOfOperationTextArea
                    value={controls.areaOfOperation.value}
                    errorMessages={controls.areaOfOperation.errorMessages()}
                  />

                  <BeaconLocationInput
                    value={controls.beaconLocation.value}
                    errorMessages={controls.beaconLocation.errorMessages()}
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
      hintText="Knowing the maximum number of persons likely to be onboard the vessel helps Search and Rescue know how many people to look for and what resources to send"
      defaultValue={value}
      numOfChars={5}
      htmlAttributes={{
        pattern: "[0-9]*",
        inputMode: "numeric",
      }}
    />
  </FormGroup>
);

const VesselNameInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="vesselName"
      label="Enter your vessel name (optional)"
      defaultValue={value}
    />
  </FormGroup>
);

const HomeportInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="homeport"
      label="Enter the Homeport for the vessel (optional)"
      hintText="This is the name of the port where your vessel is registered and primarily operates from"
      defaultValue={value}
    />
  </FormGroup>
);

const AreaOfOperationTextArea: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <TextareaCharacterCount
      id="areaOfOperation"
      label="Tell us about the typical area of operation (optional)"
      hintText="Typical areas of operation for the vessel is very helpful in assisting Search and Rescue. For example 'Whitesands Bay, St Davids, Pembrokeshire'"
      defaultValue={value}
      maxCharacters={250}
      rows={4}
    />
  </FormGroup>
);

const BeaconLocationInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <TextareaCharacterCount
      id="beaconLocation"
      label="Tell us where this beacon will be kept (optional)"
      hintText="E.g. will the beacon be attached to a life jacket, stowed inside the
    cabin, in a grab bag etc?"
      defaultValue={value}
      maxCharacters={100}
      rows={3}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/vessel-communications",
  getFormGroup
);

export default AboutTheVessel;
