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
import { CacheEntry } from "../../lib/formCache";
import { FormValidator } from "../../lib/formValidator";
import { handlePageRequest } from "../../lib/handlePageRequest";
import { ensureFormDataHasKeys } from "../../lib/utils";

interface AboutTheVesselProps {
  formData: CacheEntry;
  needsValidation?: boolean;
}

const AboutTheVessel: FunctionComponent<AboutTheVesselProps> = ({
  formData,
  needsValidation = false,
}: AboutTheVesselProps): JSX.Element => {
  formData = ensureFormDataHasKeys(
    formData,
    "maxCapacity",
    "vesselName",
    "homeport",
    "areaOfOperation",
    "beaconLocation"
  );

  const errors = FormValidator.errorSummary(formData);

  const {
    maxCapacity,
    areaOfOperation,
    beaconLocation,
  } = FormValidator.validate(formData);

  const pageHeading = "About the pleasure vessel";

  const pageHasErrors = needsValidation && FormValidator.hasErrors(formData);

  return (
    <>
      <Layout
        navigation={<BackButton href="/register-a-beacon/primary-beacon-use" />}
        title={pageHeading}
        pageHasErrors={pageHasErrors}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary
                errors={errors}
                showErrorSummary={needsValidation}
              />
              <Form action="/register-a-beacon/about-the-vessel">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <MaxCapacityInput
                    value={formData.maxCapacity}
                    showErrors={needsValidation && maxCapacity.invalid}
                    errorMessages={maxCapacity.errorMessages}
                  />

                  <VesselNameInput value={formData.vesselName} />

                  <HomeportInput value={formData.homeport} />

                  <AreaOfOperationTextArea
                    value={formData.areaOfOperation}
                    showErrors={needsValidation && areaOfOperation.invalid}
                    errorMessages={areaOfOperation.errorMessages}
                  />

                  <BeaconLocationInput
                    value={formData.beaconLocation}
                    showErrors={needsValidation && beaconLocation.invalid}
                    errorMessages={beaconLocation.errorMessages}
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
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="maxCapacity"
      label="Enter the maximum number of persons aboard"
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
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
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
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
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
  "/register-a-beacon/vessel-communications"
);

export default AboutTheVessel;
