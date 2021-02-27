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
import { FormControl } from "../../lib/form/formControl";
import { FormGroupControl } from "../../lib/form/formGroupControl";
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

const getFormGroup = ({
  emergencyContact1FullName,
  emergencyContact1TelephoneNumber,
  emergencyContact1AlternativeTelephoneNumber,
  emergencyContact2FullName,
  emergencyContact2TelephoneNumber,
  emergencyContact2AlternativeTelephoneNumber,
  emergencyContact3FullName,
  emergencyContact3TelephoneNumber,
  emergencyContact3AlternativeTelephoneNumber,
}: CacheEntry): FormGroupControl => {
  return new FormGroupControl({
    emergencyContact1FullName: new FormControl(emergencyContact1FullName, [
      Validators.required("Emergency Contact Full name is a required field"),
    ]),
    emergencyContact1TelephoneNumber: new FormControl(
      emergencyContact1TelephoneNumber,
      [Validators.required("Emergency Contact Telephone is a required field")]
    ),
    emergencyContact1AlternativeTelephoneNumber: new FormControl(
      emergencyContact1AlternativeTelephoneNumber
    ),
    emergencyContact2FullName: new FormControl(emergencyContact2FullName),
    emergencyContact2TelephoneNumber: new FormControl(
      emergencyContact2TelephoneNumber
    ),
    emergencyContact2AlternativeTelephoneNumber: new FormControl(
      emergencyContact2AlternativeTelephoneNumber
    ),
    emergencyContact3FullName: new FormControl(emergencyContact3FullName),
    emergencyContact3TelephoneNumber: new FormControl(
      emergencyContact3TelephoneNumber
    ),
    emergencyContact3AlternativeTelephoneNumber: new FormControl(
      emergencyContact3AlternativeTelephoneNumber
    ),
  });
};

const EmergencyContact: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  const formGroup = getFormGroup(formData);
  if (needsValidation) {
    formGroup.markAsDirty();
  }
  const controls = formGroup.controls;
  const pageHeading = "Add emergency contact information for up to 3 people";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/beacon-owner-address" />
        }
        title={pageHeading}
        pageHasErrors={formGroup.hasErrors()}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/emergency-contact">
                <FormFieldset>
                  <FormErrorSummary formGroup={formGroup} />
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
                    fullName={controls.emergencyContact1FullName.value}
                    telephoneNumber={
                      controls.emergencyContact1TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      controls.emergencyContact1AlternativeTelephoneNumber.value
                    }
                    fullNameErrorMessages={controls.emergencyContact1FullName.errorMessages()}
                    telephoneNumberErrorMessages={controls.emergencyContact1TelephoneNumber.errorMessages()}
                  />

                  <EmergencyContactGroup
                    index="2"
                    fullName={controls.emergencyContact2FullName.value}
                    telephoneNumber={
                      controls.emergencyContact2TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      controls.emergencyContact2AlternativeTelephoneNumber.value
                    }
                  />

                  <EmergencyContactGroup
                    index="3"
                    fullName={controls.emergencyContact3FullName.value}
                    telephoneNumber={
                      controls.emergencyContact3TelephoneNumber.value
                    }
                    alternativeTelephoneNumber={
                      controls.emergencyContact3AlternativeTelephoneNumber.value
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
  getFormGroup
);

export default EmergencyContact;
