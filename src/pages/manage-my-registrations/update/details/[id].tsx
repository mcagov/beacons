import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import {
  BeaconsForm,
  BeaconsFormHeading,
} from "../../../../components/BeaconsForm";
import { BeaconManufacturerInput } from "../../../../components/domain/formElements/BeaconManufacturerInput";
import { BeaconModelInput } from "../../../../components/domain/formElements/BeaconModelInput";
import { HexIdHelp } from "../../../../components/domain/formElements/HexIdHelp";
import { GovUKBody } from "../../../../components/Typography";
import { FieldManager } from "../../../../lib/form/FieldManager";
import { FormManager } from "../../../../lib/form/FormManager";
import { Validators } from "../../../../lib/form/Validators";
import { DraftRegistrationPageProps } from "../../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../lib/middleware/withContainer";
import { withSession } from "../../../../lib/middleware/withSession";
import { toUpperCase } from "../../../../lib/writingStyle";
import { DraftRegistrationFormMapper } from "../../../../presenters/DraftRegistrationFormMapper";
import { BeaconsPageRouter } from "../../../../router/BeaconsPageRouter";
import { GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache } from "../../../../router/rules/GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache";
import { GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage } from "../../../../router/rules/GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { IfUserDoesNotHaveValidSession } from "../../../../router/rules/IfUserDoesNotHaveValidSession";

interface UpdateBeaconDetailsForm {
  manufacturer: string;
  model: string;
  hexId: string;
}

const BeaconDetails: FunctionComponent<DraftRegistrationPageProps> = ({
  form,
  showCookieBanner,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Beacon details";

  return (
    <BeaconsForm
      previousPageUrl={"/"}
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />
      <BeaconsFormHeading pageHeading={pageHeading} />
      <BeaconManufacturerInput
        value={form.fields.manufacturer.value}
        errorMessages={form.fields.manufacturer.errorMessages}
      />
      <BeaconModelInput
        value={form.fields.model.value}
        errorMessages={form.fields.manufacturer.errorMessages}
      />
      <BeaconHexId hexId={form.fields.hexId.value} />
    </BeaconsForm>
  );
};

const BeaconHexId: FunctionComponent<{ hexId: string }> = ({
  hexId,
}: {
  hexId: string;
}): JSX.Element => (
  <>
    <br />
    <GovUKBody>The 15 character beacon HEX ID or UIN number</GovUKBody>
    <GovUKBody>Hex ID/UIN: {hexId}</GovUKBody>
    <HexIdHelp />
  </>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    return await new BeaconsPageRouter([
      new IfUserDoesNotHaveValidSession(context),
      new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
        context
      ),
      new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
        context,
        context.query.id as string
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm(
        context,
        validationRules,
        mapper
      ),
    ]).execute();
  })
);

export const mapper: DraftRegistrationFormMapper<UpdateBeaconDetailsForm> = {
  formToDraftRegistration: (form) => ({
    manufacturer: form.manufacturer,
    model: form.model,
    hexId: toUpperCase(form.hexId),
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => ({
    manufacturer: draftRegistration?.manufacturer,
    model: draftRegistration?.model,
    hexId: draftRegistration?.hexId,
  }),
};

export const validationRules = ({
  manufacturer,
  model,
  hexId,
}: UpdateBeaconDetailsForm): FormManager => {
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

export default BeaconDetails;
