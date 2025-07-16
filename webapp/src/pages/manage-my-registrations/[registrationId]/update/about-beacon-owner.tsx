import { GetServerSideProps } from "next";
import React, { FunctionComponent, type JSX } from "react";
import {
  BeaconsForm,
  BeaconsFormHeading,
} from "../../../../components/BeaconsForm";
import { FormGroup } from "../../../../components/Form";
import { FormInputProps, Input } from "../../../../components/Input";
import { FieldManager } from "../../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../../lib/form/FormManager";
import { Validators } from "../../../../lib/form/Validators";
import { BeaconsGetServerSidePropsContext } from "../../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../../lib/middleware/withContainer";
import { withSession } from "../../../../lib/middleware/withSession";
import { Actions } from "../../../../lib/URLs/Actions";
import { Pages } from "../../../../lib/URLs/Pages";
import { UrlBuilder } from "../../../../lib/URLs/UrlBuilder";
import { DraftRegistrationFormMapper } from "../../../../presenters/DraftRegistrationFormMapper";
import { FormSubmission } from "../../../../presenters/formSubmission";
import { BeaconsPageRouter } from "../../../../router/BeaconsPageRouter";
import { GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache } from "../../../../router/rules/GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache";
import { GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage } from "../../../../router/rules/GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage } from "../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface AboutBeaconOwnerForm {
  ownerFullName: string;
  ownerTelephoneNumber: string;
  ownerAlternativeTelephoneNumber: string;
  ownerEmail: string;
}

interface AboutBeaconOwnerFormProps {
  form: FormJSON;
  showCookieBanner: boolean;
  previousPageUrl: string;
}

const AboutBeaconOwner: FunctionComponent<AboutBeaconOwnerFormProps> = ({
  form,
  showCookieBanner,
  previousPageUrl,
}: AboutBeaconOwnerFormProps): JSX.Element => {
  const pageHeading = "About the beacon owner";

  return (
    <BeaconsForm
      pageHeading={pageHeading}
      formErrors={form.errorSummary}
      previousPageUrl={previousPageUrl}
      showCookieBanner={showCookieBanner}
      includeUseId={true}
    >
      <BeaconsFormHeading pageHeading={pageHeading} />
      <FullName
        value={form.fields.ownerFullName.value}
        errorMessages={form.fields.ownerFullName.errorMessages}
      />

      <TelephoneNumber
        value={form.fields.ownerTelephoneNumber.value}
        errorMessages={form.fields.ownerTelephoneNumber.errorMessages}
      />

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
      label="Telephone number"
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
      label="Email address"
      hintText="You will receive an email confirming your beacon registration application, including a reference
        number if you need to get in touch with the beacons registry team."
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const registrationId = context.query.registrationId as string;

    const nextPageUrl = UrlBuilder.buildRegistrationUrl(
      Actions.update,
      Pages.summary,
      context.query.registrationId as string,
    );

    return await new BeaconsPageRouter([
      new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(context),
      new GivenUserHasStartedEditingADifferentDraftRegistration_ThenDeleteItAndReloadPage(
        context,
      ),
      new GivenUserHasNotStartedUpdatingARegistration_ThenSaveRegistrationToCache(
        context,
        registrationId,
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<AboutBeaconOwnerForm>(
        context,
        validationRules,
        mapper,
        props(context),
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<AboutBeaconOwnerForm>(
        context,
        validationRules,
        mapper,
        props(context),
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsValidForm_ThenSaveAndGoToNextPage<AboutBeaconOwnerForm>(
        context,
        validationRules,
        mapper,
        nextPageUrl,
      ),
    ]).execute();
  }),
);

const props = async (
  context: BeaconsGetServerSidePropsContext,
): Promise<Partial<AboutBeaconOwnerFormProps>> => {
  const previousPageUrl = UrlBuilder.buildUpdateRegistrationSummaryUrl(
    context.query.registrationId as string,
  );

  return {
    previousPageUrl,
  };
};

const mapper: DraftRegistrationFormMapper<AboutBeaconOwnerForm> = {
  formToDraftRegistration: (form) => ({
    ownerFullName: form.ownerFullName,
    ownerTelephoneNumber: form.ownerTelephoneNumber,
    ownerAlternativeTelephoneNumber: form.ownerAlternativeTelephoneNumber,
    ownerEmail: form.ownerEmail,
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => ({
    ownerFullName: draftRegistration.ownerFullName,
    ownerTelephoneNumber: draftRegistration.ownerTelephoneNumber,
    ownerAlternativeTelephoneNumber:
      draftRegistration.ownerAlternativeTelephoneNumber,
    ownerEmail: draftRegistration.ownerEmail,
  }),
};

const validationRules = ({
  ownerFullName,
  ownerTelephoneNumber,
  ownerAlternativeTelephoneNumber,
  ownerEmail,
}: FormSubmission): FormManager => {
  return new FormManager({
    ownerFullName: new FieldManager(ownerFullName, [
      Validators.required("Full name is a required field"),
    ]),
    ownerTelephoneNumber: new FieldManager(ownerTelephoneNumber, [
      Validators.required("Telephone number is a required field"),
    ]),
    ownerAlternativeTelephoneNumber: new FieldManager(
      ownerAlternativeTelephoneNumber,
    ),
    ownerEmail: new FieldManager(ownerEmail, [
      Validators.required("Email address is a required field"),
      Validators.email("Email address must be valid"),
    ]),
  });
};

export default AboutBeaconOwner;
