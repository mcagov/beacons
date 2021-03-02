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
import { FieldInput } from "../../lib/form/fieldInput";
import { FieldManager } from "../../lib/form/fieldManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

export interface EmergencyContactGroupProps {
  index: string;
  fullName: string;
  telephoneNumber: string;
  alternativeTelephoneNumber: string;
  fullNameErrorMessages?: string[];
  fullNameErrors?: boolean;
  telephoneNumberErrorMessages?: string[];
  telephoneNumberErrors?: boolean;
}

const getFieldManager = ({
  emergencyContact1FullName,
  emergencyContact1TelephoneNumber,
  emergencyContact1AlternativeTelephoneNumber,
  emergencyContact2FullName,
  emergencyContact2TelephoneNumber,
  emergencyContact2AlternativeTelephoneNumber,
  emergencyContact3FullName,
  emergencyContact3TelephoneNumber,
  emergencyContact3AlternativeTelephoneNumber,
}: CacheEntry): FieldManager => {
  return new FieldManager({
    emergencyContact1FullName: new FieldInput(emergencyContact1FullName, [
      Validators.required("Emergency Contact Full name is a required field"),
    ]),
    emergencyContact1TelephoneNumber: new FieldInput(
      emergencyContact1TelephoneNumber,
      [Validators.required("Emergency Contact Telephone is a required field")]
    ),
    emergencyContact1AlternativeTelephoneNumber: new FieldInput(
      emergencyContact1AlternativeTelephoneNumber
    ),
    emergencyContact2FullName: new FieldInput(emergencyContact2FullName),
    emergencyContact2TelephoneNumber: new FieldInput(
      emergencyContact2TelephoneNumber
    ),
    emergencyContact2AlternativeTelephoneNumber: new FieldInput(
      emergencyContact2AlternativeTelephoneNumber
    ),
    emergencyContact3FullName: new FieldInput(emergencyContact3FullName),
    emergencyContact3TelephoneNumber: new FieldInput(
      emergencyContact3TelephoneNumber
    ),
    emergencyContact3AlternativeTelephoneNumber: new FieldInput(
      emergencyContact3AlternativeTelephoneNumber
    ),
  });
};

const EmergencyContact: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  const fieldManager = getFieldManager(formData);
  if (needsValidation) {
    fieldManager.markAsDirty();
  }
  const fields = fieldManager.fields;
  const pageHeading = "Add emergency contact information for up to 3 people";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/beacon-owner-address" />
        }
        title={pageHeading}
        pageHasErrors={fieldManager.hasErrors()}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/emergency-contact">
                <FormFieldset>
                  <FormErrorSummary formErrors={fieldManager.errorSummary()} />
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
                    fullName={fields.emergencyContact1FullName.value}
                    telephoneNumber={
                      fields.emergencyContact1TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      fields.emergencyContact1AlternativeTelephoneNumber.value
                    }
                    fullNameErrorMessages={fields.emergencyContact1FullName.errorMessages()}
                    telephoneNumberErrorMessages={fields.emergencyContact1TelephoneNumber.errorMessages()}
                  />

                  <EmergencyContactGroup
                    index="2"
                    fullName={fields.emergencyContact2FullName.value}
                    telephoneNumber={
                      fields.emergencyContact2TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      fields.emergencyContact2AlternativeTelephoneNumber.value
                    }
                  />

                  <EmergencyContactGroup
                    index="3"
                    fullName={fields.emergencyContact3FullName.value}
                    telephoneNumber={
                      fields.emergencyContact3TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      fields.emergencyContact3AlternativeTelephoneNumber.value
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

const EmergencyContactGroup: FunctionComponent<EmergencyContactGroupProps> = ({
  index = "",
  fullName = "",
  telephoneNumber = "",
  alternativeTelephoneNumber = "",
  fullNameErrorMessages,
  telephoneNumberErrorMessages,
}: EmergencyContactGroupProps): JSX.Element => (
  <>
    <FormLegend className="govuk-fieldset__legend--m">
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

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/",
  getFieldManager
);

export default EmergencyContact;
