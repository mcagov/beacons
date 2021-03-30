import { GetServerSideProps } from "next";
import React, { FunctionComponent, ReactNode } from "react";
import { BackButtonRouterIndexes, Button } from "../../components/Button";
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
import { TextareaCharacterCount } from "../../components/Textarea";
import { SectionHeading } from "../../components/Typography";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

const definePageForm = ({
  maxCapacity,
  vesselName,
  beaconLocation,
  portLetterNumber,
  homeport,
  areaOfOperation,
  imoNumber,
  ssrNumber,
  officialNumber,
  rigPlatformLocation,
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
    vesselName: new FieldManager(vesselName),
    beaconLocation: new FieldManager(beaconLocation, [
      Validators.maxLength(
        "Where the beacon is kept has too many characters",
        100
      ),
    ]),
    portLetterNumber: new FieldManager(portLetterNumber),
    homeport: new FieldManager(homeport),
    areaOfOperation: new FieldManager(areaOfOperation, [
      Validators.maxLength(
        "Typical area of operation has too many characters",
        250
      ),
    ]),
    imoNumber: new FieldManager(imoNumber),
    ssrNumber: new FieldManager(ssrNumber),
    officialNumber: new FieldManager(officialNumber),
    rigPlatformLocation: new FieldManager(rigPlatformLocation),
  });
};

const AboutTheVessel: FunctionComponent<FormPageProps> = ({
  form,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  const pageHeading = "About the vessel, windfarm or rig/platform";

  const backButton: ReactNode = (
    <BackButtonRouterIndexes href="/register-a-beacon/activity" />
  );

  return (
    <>
      <Layout
        navigation={backButton}
        title={pageHeading}
        pageHasErrors={form.hasErrors}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary formErrors={form.errorSummary} />
              <Form>
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <InsetText>
                    Leave anything that isn&apos;t relevant blank. Any
                    information you do provide may help save lives in a Search
                    and Rescue scenario.
                  </InsetText>

                  <MaxCapacityInput
                    value={form.fields.maxCapacity.value}
                    errorMessages={form.fields.maxCapacity.errorMessages}
                  />

                  <VesselNameInput value={form.fields.vesselName.value} />

                  <BeaconLocationInput
                    value={form.fields.beaconLocation.value}
                    errorMessages={form.fields.beaconLocation.errorMessages}
                  />

                  <SectionHeading>Vessel information</SectionHeading>

                  <PortLetterNumberInput
                    value={form.fields.portLetterNumber.value}
                  />

                  <HomeportInput value={form.fields.homeport.value} />

                  <AreaOfOperationTextArea
                    value={form.fields.areaOfOperation.value}
                    errorMessages={form.fields.areaOfOperation.errorMessages}
                  />

                  <ImoNumberInput value={form.fields.imoNumber.value} />

                  <SsrNumberInput value={form.fields.ssrNumber.value} />

                  <OfficialNumberInput
                    value={form.fields.officialNumber.value}
                  />

                  <SectionHeading>
                    Windfarm, rig or platform information
                  </SectionHeading>

                  <RigPlatformLocationInput
                    value={form.fields.rigPlatformLocation.value}
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
      hintText="This helps Search and Rescue know how many people to look for and what resources to send"
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
      label="Enter your vessel, windfarm or rig/platform name (optional)"
      defaultValue={value}
    />
  </FormGroup>
);

const PortLetterNumberInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="portLetterNumber"
      label="If you have one, enter the Port Letter & Number or PLN (optional)"
      hintText="This is a code identifying fishing vessels, usually printed on the boat. The format is XYZ123"
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
  <TextareaCharacterCount
    id="areaOfOperation"
    label="Tell us about the typical area of operation (optional)"
    hintText="This is very helpful in assisting Search & Rescue. For example 'Whitesands Bay, St Davids, Pembrokeshire'"
    defaultValue={value}
    errorMessages={errorMessages}
    maxCharacters={250}
    rows={4}
  />
);

const ImoNumberInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="imoNumber"
      label="If you have one, enter the IMO number (optional)"
      hintText="An IMO number is made of the three letters 'IMO' followed by a seven-digit number."
      defaultValue={value}
    />
  </FormGroup>
);

const SsrNumberInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="ssrNumber"
      label="If you have one, enter the UK Small Ships Register (SSR)  number (optional)"
      /*TODO update with SSR number format*/
      hintText="Hint text for format"
      defaultValue={value}
    />
  </FormGroup>
);

const OfficialNumberInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="officialNumber"
      label="If you have one, enter vessel's official number (optional)"
      hintText="Official numbers are ship identifier numbers assigned to merchant ships by their country or registration."
      defaultValue={value}
    />
  </FormGroup>
);

const RigPlatformLocationInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <Input
      id="rigPlatformLocation"
      label="Where is the rig or platform located? (optional)"
      hintText="You can enter a place or area name, area or latitude/longitude co-ordinates"
      defaultValue={value}
    />
  </FormGroup>
);

const BeaconLocationInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <TextareaCharacterCount
    id="beaconLocation"
    label="Tell us where this beacon will be kept (optional)"
    hintText="E.g. will the beacon be attached to a life jacket, stowed inside the
    cabin, in a grab bag etc?"
    defaultValue={value}
    errorMessages={errorMessages}
    maxCharacters={100}
    rows={3}
  />
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/vessel-communications",
  definePageForm
);

export default AboutTheVessel;
