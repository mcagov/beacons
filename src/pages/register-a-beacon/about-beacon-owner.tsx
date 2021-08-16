import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { FormGroup } from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { NoFieldSetOrLegendForm } from "../../components/NoFieldSetOrLegendForm";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import { PageURLs, queryParams } from "../../lib/urls";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { FormSubmission } from "../../presenters/formSubmission";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserSubmittedInvalidRegistrationForm } from "../../router/rules/IfUserSubmittedInvalidRegistrationForm";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";
import { IfUserViewedRegistrationForm } from "../../router/rules/IfUserViewedRegistrationForm";

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
    <NoFieldSetOrLegendForm
      pageHeading={pageHeading}
      formErrors={form.errorSummary}
      previousPageUrl={previousPageUrl}
      showCookieBanner={showCookieBanner}
      includeUseIndex={true}
    >
      <FullName
        value={form.fields.ownerFullName.value}
        errorMessages={form.fields.ownerFullName.errorMessages}
      />

      <TelephoneNumber value={form.fields.ownerTelephoneNumber.value} />

      <AlternativeTelephoneNumber
        value={form.fields.ownerAlternativeTelephoneNumber.value}
      />

      <EmailAddress
        value={form.fields.ownerEmail.value}
        errorMessages={form.fields.ownerEmail.errorMessages}
      />
    </NoFieldSetOrLegendForm>
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
      label="Telephone number (optional)"
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
      label="Email address (optional)"
      hintText="You will receive an email confirming your beacon registration application, including a reference
        number if you need to get in touch with the beacons registry team."
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPageUrl = PageURLs.beaconOwnerAddress;

    return await new BeaconsPageRouter([
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new IfUserViewedRegistrationForm<AboutBeaconOwnerForm>(
        context,
        validationRules,
        mapper,
        props(context)
      ),
      new IfUserSubmittedInvalidRegistrationForm<AboutBeaconOwnerForm>(
        context,
        validationRules,
        mapper,
        props(context)
      ),
      new IfUserSubmittedValidRegistrationForm<AboutBeaconOwnerForm>(
        context,
        validationRules,
        mapper,
        nextPageUrl
      ),
    ]).execute();
  })
);

const props = async (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<AboutBeaconOwnerFormProps>> => {
  const uses =
    (
      await context.container.getDraftRegistration(
        context.req.cookies[formSubmissionCookieId]
      )
    )?.uses || [];

  const previousPageUrl =
    PageURLs.additionalUse +
    queryParams({ useIndex: uses.length > 1 ? uses.length - 1 : 0 });

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
    ownerTelephoneNumber: new FieldManager(ownerTelephoneNumber),
    ownerAlternativeTelephoneNumber: new FieldManager(
      ownerAlternativeTelephoneNumber
    ),
    ownerEmail: new FieldManager(ownerEmail, [
      Validators.email("Email address must be valid"),
    ]),
  });
};

export default AboutBeaconOwner;
