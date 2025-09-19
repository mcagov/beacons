import { GetServerSideProps } from "next";
import React, { FunctionComponent, type JSX } from "react";
import { BeaconsForm, BeaconsFormHeading } from "../../components/BeaconsForm";
import { BeaconManufacturerInput } from "../../components/domain/formElements/BeaconManufacturerInput";
import { BeaconModelInput } from "../../components/domain/formElements/BeaconModelInput";
import { HexIdHelp } from "../../components/domain/formElements/HexIdHelp";
import { FormGroup } from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { GovUKBody } from "../../components/Typography";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { DraftRegistrationPageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { AccountPageURLs, CreateRegistrationPageURLs } from "../../lib/urls";
import { toUpperCase } from "../../lib/writingStyle";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";
import { withAdditionalProps } from "../../router/withAdditionalProps";
import { CheckboxListItem } from "../../components/Checkbox";
import { parseFormDataAs } from "../../lib/middleware";

interface CheckBeaconDetailsForm {
  manufacturer: string;
  model: string;
  hexId: string;
  isSecondGeneration: boolean;
}

const CheckBeaconDetails: FunctionComponent<DraftRegistrationPageProps> = ({
  form,
  showCookieBanner,
  previousPageUrl,
  draftRegistration,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Check beacon details";
  const pageText = (
    <GovUKBody>
      The details of your beacon must be checked to ensure it is programmed for
      UK registration.
    </GovUKBody>
  );

  return (
    <BeaconsForm
      formErrors={form.errorSummary}
      previousPageUrl={previousPageUrl}
      includeUseId={false}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />
      {pageText}
      <BeaconManufacturerInput
        value={form.fields.manufacturer.value}
        errorMessages={form.fields.manufacturer.errorMessages}
      />
      <BeaconModelInput
        value={form.fields.model.value}
        errorMessages={form.fields.model.errorMessages}
      />

      <BeaconIsSecondGenerationCheckbox
        value={draftRegistration.isSecondGeneration ? "true" : "false"}
      />

      <BeaconHexIdInput
        value={form.fields.hexId.value}
        errorMessages={form.fields.hexId.errorMessages}
      />
    </BeaconsForm>
  );
};

const BeaconIsSecondGenerationCheckbox: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup>
    <CheckboxListItem
      id="isSecondGeneration"
      defaultChecked={value == "true"}
      label="Is Second Generation (23 Character) HEX ID"
    />
  </FormGroup>
);

const BeaconHexIdInput: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="hexId"
      label="Enter the beacon HEX ID or UIN number"
      hintText="This will be on your beacon. It must use
      characters 0 to 9 and letters A to F"
      htmlAttributes={{ spellCheck: false }}
      defaultValue={value}
    />
    <HexIdHelp />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPageUrl = CreateRegistrationPageURLs.beaconInformation;
    const previousPageUrl =
      context.query.previous ?? AccountPageURLs.accountHome;

    const formData = await parseFormDataAs<CheckBeaconDetailsForm>(context.req);

    return withAdditionalProps(
      new BeaconsPageRouter([
        new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
        new GivenUserIsEditingADraftRegistration_WhenNoDraftRegistrationExists_ThenRedirectUserToRegistryAccountPage(
          context,
        ),
        new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm(
          context,
          validationRules,
          mapper,
        ),
        new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors(
          context,
          validationRules,
          mapper,
        ),
        new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage(
          context,
          validationRules,
          mapper,
          nextPageUrl,
        ),
      ]),
      {
        previousPageUrl,
        draftRegistration: {
          isSecondGeneration: formData?.isSecondGeneration || false,
        },
      },
    );
  }),
);

export const mapper: DraftRegistrationFormMapper<CheckBeaconDetailsForm> = {
  formToDraftRegistration: (form) => ({
    manufacturer: form.manufacturer,
    model: form.model,
    hexId: toUpperCase(form.hexId),
    isSecondGeneration: form.isSecondGeneration || false,
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => ({
    manufacturer: draftRegistration?.manufacturer,
    model: draftRegistration?.model,
    hexId: draftRegistration?.hexId,
    isSecondGeneration: draftRegistration?.isSecondGeneration,
  }),
};

export const validationRules = ({
  manufacturer,
  model,
  hexId,
  isSecondGeneration,
}: CheckBeaconDetailsForm): FormManager => {
  const hexIdLength = isSecondGeneration ? 23 : 15;
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
        `Beacon HEX ID or UIN must be ${hexIdLength} characters long`,
        hexIdLength,
      ),
      Validators.hexadecimalString(
        "Beacon HEX ID or UIN must use numbers 0 to 9 and letters A to F",
      ),
      Validators.ukEncodedBeacon(
        "You entered a beacon encoded with a Hex ID from %HEX_ID_COUNTRY%.  Your beacon must be UK-encoded to use this service.",
      ),
      Validators.shouldNotContain(
        'Your HEX ID should not contain the letter "O".  Did you mean the number zero?',
        "O",
      ),
    ]),
  });
};

export default CheckBeaconDetails;
