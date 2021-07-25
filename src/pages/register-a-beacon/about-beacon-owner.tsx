import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BeaconsForm } from "../../components/BeaconsForm";
import { FormGroup } from "../../components/Form";
import { FormInputProps, Input } from "../../components/Input";
import { FieldManager } from "../../lib/form/fieldManager";
import { FormJSON, FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { FormSubmission } from "../../lib/formCache";
import { FormPageProps } from "../../lib/handlePageRequest";
import { withCookiePolicy } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { formSubmissionCookieId } from "../../lib/types";
import { PageURLs, queryParams } from "../../lib/urls";
import { RegistrationFormMapper } from "../../presenters/RegistrationFormMapper";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { IfUserSubmittedInvalidRegistrationFormRule } from "../../router/rules/IfUserSubmittedInvalidRegistrationFormRule";
import { IfUserSubmittedValidRegistrationFormRule } from "../../router/rules/IfUserSubmittedValidRegistrationFormRule";
import { IfUserViewedRegistrationFormRule } from "../../router/rules/IfUserViewedRegistrationFormRule";

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

const AboutBeaconOwner: FunctionComponent<FormPageProps> = ({
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

export const getServerSideProps: GetServerSideProps = withCookiePolicy(
  withContainer(
    withSession(async (context: BeaconsGetServerSidePropsContext) => {
      const nextPageUrl = PageURLs.beaconOwnerAddress;

      return await new BeaconsPageRouter([
        new IfUserViewedRegistrationFormRule<AboutBeaconOwnerForm>(
          context,
          validationRules,
          mapper,
          props(context)
        ),
        new IfUserSubmittedInvalidRegistrationFormRule<AboutBeaconOwnerForm>(
          context,
          validationRules,
          mapper,
          props(context)
        ),
        new IfUserSubmittedValidRegistrationFormRule<AboutBeaconOwnerForm>(
          context,
          validationRules,
          mapper,
          nextPageUrl
        ),
      ]).execute();
    })
  )
);

const props = (
  context: BeaconsGetServerSidePropsContext
): Promise<Partial<AboutBeaconOwnerFormProps>> =>
  (async () => {
    const draftRegistration = await context.container.getDraftRegistration(
      context.req.cookies[formSubmissionCookieId]
    );

    const previousPageUrl =
      PageURLs.additionalUse +
      queryParams({ useIndex: draftRegistration.uses.length - 1 });

    return {
      previousPageUrl,
    };
  })();

const mapper: RegistrationFormMapper<AboutBeaconOwnerForm> = {
  toDraftRegistration: (form) => ({
    ownerFullName: form.ownerFullName,
    ownerTelephoneNumber: form.ownerTelephoneNumber,
    ownerAlternativeTelephoneNumber: form.ownerAlternativeTelephoneNumber,
    ownerEmail: form.ownerEmail,
  }),
  toForm: (draftRegistration) => ({
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
