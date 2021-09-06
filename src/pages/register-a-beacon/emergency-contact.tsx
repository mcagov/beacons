import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegend,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { WarningText } from "../../components/WarningText";
import { FieldManager } from "../../lib/form/FieldManager";
import { FormManager } from "../../lib/form/FormManager";
import { Validators } from "../../lib/form/Validators";
import { DraftRegistrationPageProps } from "../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { CreateRegistrationPageURLs } from "../../lib/urls";
import { DraftRegistrationFormMapper } from "../../presenters/DraftRegistrationFormMapper";
import { FormSubmission } from "../../presenters/formSubmission";
import { BeaconsPageRouter } from "../../router/BeaconsPageRouter";
import { GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors";
import { GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm } from "../../router/rules/GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm";
import { IfUserDoesNotHaveValidSession } from "../../router/rules/IfUserDoesNotHaveValidSession";
import { IfUserHasNotStartedEditingADraftRegistration } from "../../router/rules/IfUserHasNotStartedEditingADraftRegistration";
import { IfUserSubmittedValidRegistrationForm } from "../../router/rules/IfUserSubmittedValidRegistrationForm";

interface EmergencyContactForm {
  emergencyContact1FullName: string;
  emergencyContact1TelephoneNumber: string;
  emergencyContact1AlternativeTelephoneNumber: string;
  emergencyContact2FullName: string;
  emergencyContact2TelephoneNumber: string;
  emergencyContact2AlternativeTelephoneNumber: string;
  emergencyContact3FullName: string;
  emergencyContact3TelephoneNumber: string;
  emergencyContact3AlternativeTelephoneNumber: string;
}

const EmergencyContact: FunctionComponent<DraftRegistrationPageProps> = ({
  form,
  showCookieBanner,
}: DraftRegistrationPageProps): JSX.Element => {
  const pageHeading = "Add emergency contact information for up to 3 people";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/beacon-owner-address" />
        }
        title={pageHeading}
        pageHasErrors={form.hasErrors}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <Form>
                <FormFieldset>
                  <FormErrorSummary formErrors={form.errorSummary} />
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <InsetText>
                    Your emergency contact information is vital for Search and
                    Rescue. Provide as much detail as possible. Provide at least
                    one contact.
                  </InsetText>
                  <WarningText>
                    It is important that all your emergency contacts know the
                    details of any trip you make, such as departure and expected
                    arrival times, your planned route, how many persons you will
                    be with and how to reach you in an emergency.
                    <br />
                    Only choose those people likely to know this information to
                    be your emergency contact(s).
                  </WarningText>

                  <EmergencyContactGroup
                    index="1"
                    fullName={form.fields.emergencyContact1FullName.value}
                    telephoneNumber={
                      form.fields.emergencyContact1TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      form.fields.emergencyContact1AlternativeTelephoneNumber
                        .value
                    }
                    fullNameErrorMessages={
                      form.fields.emergencyContact1FullName.errorMessages
                    }
                    telephoneNumberErrorMessages={
                      form.fields.emergencyContact1TelephoneNumber.errorMessages
                    }
                  />

                  <EmergencyContactGroup
                    index="2"
                    fullName={form.fields.emergencyContact2FullName.value}
                    telephoneNumber={
                      form.fields.emergencyContact2TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      form.fields.emergencyContact2AlternativeTelephoneNumber
                        .value
                    }
                  />

                  <EmergencyContactGroup
                    index="3"
                    fullName={form.fields.emergencyContact3FullName.value}
                    telephoneNumber={
                      form.fields.emergencyContact3TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      form.fields.emergencyContact3AlternativeTelephoneNumber
                        .value
                    }
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

interface EmergencyContactGroupProps {
  index: string;
  fullName: string;
  telephoneNumber: string;
  alternativeTelephoneNumber: string;
  fullNameErrorMessages?: string[];
  fullNameErrors?: boolean;
  telephoneNumberErrorMessages?: string[];
  telephoneNumberErrors?: boolean;
}

const EmergencyContactGroup: FunctionComponent<EmergencyContactGroupProps> = ({
  index = "",
  fullName = "",
  telephoneNumber = "",
  alternativeTelephoneNumber = "",
  fullNameErrorMessages,
  telephoneNumberErrorMessages,
}: EmergencyContactGroupProps): JSX.Element => (
  <>
    <FormLegend size="medium">
      Emergency contact {index}
      {index == "1" ? "" : " (optional)"}
    </FormLegend>
    <FormGroup errorMessages={fullNameErrorMessages}>
      <Input
        id={"emergencyContact" + index + "FullName"}
        label={
          "Emergency contact's full name" + (index == "1" ? "" : " (optional)")
        }
        defaultValue={fullName}
      />
    </FormGroup>
    <FormGroup errorMessages={telephoneNumberErrorMessages}>
      <Input
        id={"emergencyContact" + index + "TelephoneNumber"}
        label={
          "Emergency contact's primary telephone number" +
          (index == "1" ? "" : " (optional)")
        }
        defaultValue={telephoneNumber}
      />
    </FormGroup>
    <FormGroup>
      <Input
        id={"emergencyContact" + index + "AlternativeTelephoneNumber"}
        label="Emergency contact's secondary telephone number (optional)"
        defaultValue={alternativeTelephoneNumber}
      />
    </FormGroup>
  </>
);

export const getServerSideProps: GetServerSideProps = withContainer(
  withSession(async (context: BeaconsGetServerSidePropsContext) => {
    const nextPageUrl = CreateRegistrationPageURLs.checkYourAnswers;

    return await new BeaconsPageRouter([
      new IfUserDoesNotHaveValidSession(context),
      new IfUserHasNotStartedEditingADraftRegistration(context),
      new GivenUserIsEditingADraftRegistration_WhenUserViewsForm_ThenShowForm<EmergencyContactForm>(
        context,
        validationRules,
        mapper
      ),
      new GivenUserIsEditingADraftRegistration_WhenUserSubmitsInvalidForm_ThenShowErrors<EmergencyContactForm>(
        context,
        validationRules,
        mapper
      ),
      new IfUserSubmittedValidRegistrationForm<EmergencyContactForm>(
        context,
        validationRules,
        mapper,
        nextPageUrl
      ),
    ]).execute();
  })
);

const mapper: DraftRegistrationFormMapper<EmergencyContactForm> = {
  formToDraftRegistration: (form) => ({
    emergencyContact1FullName: form.emergencyContact1FullName,
    emergencyContact1TelephoneNumber: form.emergencyContact1TelephoneNumber,
    emergencyContact1AlternativeTelephoneNumber:
      form.emergencyContact1AlternativeTelephoneNumber,
    emergencyContact2FullName: form.emergencyContact2FullName,
    emergencyContact2TelephoneNumber: form.emergencyContact2TelephoneNumber,
    emergencyContact2AlternativeTelephoneNumber:
      form.emergencyContact2AlternativeTelephoneNumber,
    emergencyContact3FullName: form.emergencyContact3FullName,
    emergencyContact3TelephoneNumber: form.emergencyContact3TelephoneNumber,
    emergencyContact3AlternativeTelephoneNumber:
      form.emergencyContact3AlternativeTelephoneNumber,
    uses: [],
  }),
  draftRegistrationToForm: (draftRegistration) => ({
    emergencyContact1FullName: draftRegistration.emergencyContact1FullName,
    emergencyContact1TelephoneNumber:
      draftRegistration.emergencyContact1TelephoneNumber,
    emergencyContact1AlternativeTelephoneNumber:
      draftRegistration.emergencyContact1AlternativeTelephoneNumber,
    emergencyContact2FullName: draftRegistration.emergencyContact2FullName,
    emergencyContact2TelephoneNumber:
      draftRegistration.emergencyContact2TelephoneNumber,
    emergencyContact2AlternativeTelephoneNumber:
      draftRegistration.emergencyContact2AlternativeTelephoneNumber,
    emergencyContact3FullName: draftRegistration.emergencyContact3FullName,
    emergencyContact3TelephoneNumber:
      draftRegistration.emergencyContact3TelephoneNumber,
    emergencyContact3AlternativeTelephoneNumber:
      draftRegistration.emergencyContact3AlternativeTelephoneNumber,
  }),
};

const validationRules = ({
  emergencyContact1FullName,
  emergencyContact1TelephoneNumber,
  emergencyContact1AlternativeTelephoneNumber,
  emergencyContact2FullName,
  emergencyContact2TelephoneNumber,
  emergencyContact2AlternativeTelephoneNumber,
  emergencyContact3FullName,
  emergencyContact3TelephoneNumber,
  emergencyContact3AlternativeTelephoneNumber,
}: FormSubmission): FormManager => {
  return new FormManager({
    emergencyContact1FullName: new FieldManager(emergencyContact1FullName, [
      Validators.required("Emergency contact full name is a required field"),
    ]),
    emergencyContact1TelephoneNumber: new FieldManager(
      emergencyContact1TelephoneNumber,
      [
        Validators.required(
          "Emergency contact telephone number is a required field"
        ),
        Validators.phoneNumber(
          "Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192"
        ),
      ]
    ),
    emergencyContact1AlternativeTelephoneNumber: new FieldManager(
      emergencyContact1AlternativeTelephoneNumber
    ),
    emergencyContact2FullName: new FieldManager(emergencyContact2FullName),
    emergencyContact2TelephoneNumber: new FieldManager(
      emergencyContact2TelephoneNumber
    ),
    emergencyContact2AlternativeTelephoneNumber: new FieldManager(
      emergencyContact2AlternativeTelephoneNumber
    ),
    emergencyContact3FullName: new FieldManager(emergencyContact3FullName),
    emergencyContact3TelephoneNumber: new FieldManager(
      emergencyContact3TelephoneNumber
    ),
    emergencyContact3AlternativeTelephoneNumber: new FieldManager(
      emergencyContact3AlternativeTelephoneNumber
    ),
  });
};

export default EmergencyContact;
