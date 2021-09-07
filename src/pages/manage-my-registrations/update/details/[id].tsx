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
import { DraftRegistration } from "../../../../entities/DraftRegistration";
import { FieldManager } from "../../../../lib/form/FieldManager";
import { FormManager } from "../../../../lib/form/FormManager";
import { Validators } from "../../../../lib/form/Validators";
import { DraftRegistrationPageProps } from "../../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../lib/middleware/withContainer";
import { withSession } from "../../../../lib/middleware/withSession";
import { UpdatePageURLs } from "../../../../lib/urls";
import { toUpperCase } from "../../../../lib/writingStyle";
import { DraftRegistrationFormMapper } from "../../../../presenters/DraftRegistrationFormMapper";
import { BeaconsPageRouter } from "../../../../router/BeaconsPageRouter";
import { GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache } from "../../../../router/rules/GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache";
import { GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage } from "../../../../router/rules/GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface UpdateBeaconDetailsForm {
  manufacturer: string;
  model: string;
  hexId: string;
}

interface BeaconDetailsProps extends DraftRegistrationPageProps {
  registration: DraftRegistration;
}

const BeaconDetails: FunctionComponent<BeaconDetailsProps> = ({
  form,
  registration,
  showCookieBanner,
}: BeaconDetailsProps): JSX.Element => {
  const pageHeading = "Beacon details";

  return (
    <BeaconsForm
      previousPageUrl={
        UpdatePageURLs.registrationSummary + "/" + registration.id
      }
      pageHeading={pageHeading}
      showCookieBanner={showCookieBanner}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />
      <GovUKBody>
        The Unique Identifying Number (UIN) or Hexadecimal Identification (HEX
        ID) of a registered beacon is not editable.
        <br />
        <br />
        If you wish to change the beacon&apos;s UIN or HEX ID, you must first
        delete the registration then register the beacon again with the new
        UIN/HEX ID.
      </GovUKBody>
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
    const nextPageURL = UpdatePageURLs.beaconInformation + context.query.id;

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
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
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors(
        context,
        validationRules,
        mapper
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage(
        context,
        validationRules,
        mapper,
        nextPageURL
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
    hexId: new FieldManager(hexId, []),
  });
};

export default BeaconDetails;
