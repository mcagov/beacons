import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm, BeaconsFormHeading } from "../../components/BeaconsForm";
import {
  FormFieldset,
  FormGroup,
  FormHint,
  FormLegend,
} from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { RadioList, RadioListItem } from "../../components/RadioList";
import { TextareaCharacterCount } from "../../components/Textarea";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { DraftBeaconUsePageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { nextPageWithUseIndex } from "../../lib/nextPageWithUseIndexHelper";
import { CreateRegistrationPageURLs, queryParams } from "../../lib/urls";
import { BeaconUseFormMapper } from "../../presenters/BeaconUseFormMapper";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { FormSubmission } from "../../presenters/formSubmission";
import { makeDraftRegistrationMapper } from "../../presenters/makeDraftRegistrationMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse } from "../../router/rules/GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface AboutTheAircraftForm {
  maxCapacity: string;
  aircraftManufacturer: string;
  principalAirport: string;
  secondaryAirport: string;
  registrationMark: string;
  hexAddress: string;
  cnOrMsnNumber: string;
  dongle: string;
  beaconPosition: string;
}

const AboutTheAircraft: FunctionComponent<DraftBeaconUsePageProps> = ({
  form,
  showCookieBanner,
  useIndex,
}: DraftBeaconUsePageProps): JSX.Element => {
  const pageHeading = "About the aircraft";

  return (
    <BeaconsForm
      previousPageUrl={
        CreateRegistrationPageURLs.activity + queryParams({ useIndex })
      }
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
      formErrors={form.errorSummary}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />

      <MaxCapacityInput
        value={form.fields.maxCapacity.value}
        errorMessages={form.fields.maxCapacity.errorMessages}
      />

      <Manufacturer value={form.fields.aircraftManufacturer.value} />

      <PrincipalAirport value={form.fields.principalAirport.value} />

      <SecondaryAirport value={form.fields.secondaryAirport.value} />

      <RegistrationMark value={form.fields.registrationMark.value} />

      <HexAddress value={form.fields.hexAddress.value} />

      <CoreNumberOrManufacturerSerialNumber
        value={form.fields.cnOrMsnNumber.value}
      />

      <Dongle value={form.fields.dongle.value} />

      <BeaconPosition
        value={form.fields.beaconPosition.value}
        errorMessages={form.fields.beaconPosition.errorMessages}
      />
    </BeaconsForm>
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

const CoreNumberOrManufacturerSerialNumber: FunctionComponent<FormInputProps> =
  ({ value = "" }: FormInputProps): JSX.Element => (
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
      <FormLegend>Is the beacon a USB dongle? (optional)</FormLegend>
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
          label="No"
          defaultChecked={value === "false"}
        />
        <RadioListItem
          id="dongle-yes"
          name="dongle"
          value="true"
          label="Yes"
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

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToStartPage(
        context
      ),
      new GivenUserIsEditingAUse_IfNoUseIsSpecified_ThenSendUserToHighestUseIndexOrCreateNewUse(
        context
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<AboutTheAircraftForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<AboutTheAircraftForm>(
        context,
        validationRules,
        mapper(context),
        props(context)
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage<AboutTheAircraftForm>(
        context,
        validationRules,
        mapper(context),
        nextPageWithUseIndex(
          parseInt(context.query.useIndex as string),
          CreateRegistrationPageURLs.aircraftCommunications
        )
      ),
    ]).execute();
  })
);

const props = (
  context: BeaconsGetServerSidePropsContext
): Partial<DraftBeaconUsePageProps> => ({
  useIndex: parseInt(context.query.useIndex as string),
});

const mapper = (
  context: BeaconsGetServerSidePropsContext
): DraftRegistrationFormMapper<AboutTheAircraftForm> => {
  const beaconUseMapper: BeaconUseFormMapper<AboutTheAircraftForm> = {
    formToDraftBeaconUse: (form) => ({
      maxCapacity: form.maxCapacity,
      aircraftManufacturer: form.aircraftManufacturer,
      principalAirport: form.principalAirport,
      secondaryAirport: form.secondaryAirport,
      registrationMark: form.registrationMark,
      hexAddress: form.hexAddress,
      cnOrMsnNumber: form.cnOrMsnNumber,
      dongle: form.dongle || null,
      beaconPosition: form.beaconPosition,
    }),
    beaconUseToForm: (draftRegistration) => ({
      maxCapacity: draftRegistration.maxCapacity,
      aircraftManufacturer: draftRegistration.aircraftManufacturer,
      principalAirport: draftRegistration.principalAirport,
      secondaryAirport: draftRegistration.secondaryAirport,
      registrationMark: draftRegistration.registrationMark,
      hexAddress: draftRegistration.hexAddress,
      cnOrMsnNumber: draftRegistration.cnOrMsnNumber,
      dongle: draftRegistration.dongle,
      beaconPosition: draftRegistration.beaconPosition,
    }),
  };

  const useIndex = parseInt(context.query.useIndex as string);

  return makeDraftRegistrationMapper<AboutTheAircraftForm>(
    useIndex,
    beaconUseMapper
  );
};

const validationRules = ({
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

export default AboutTheAircraft;
