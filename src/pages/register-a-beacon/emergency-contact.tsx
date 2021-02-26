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
import { FormValidator } from "../../lib/form/formValidator";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { ensureFormDataHasKeys } from "../../lib/utils";

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

const EmergencyContact: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  formData = ensureFormDataHasKeys(
    formData,
    "emergencyContact1FullName",
    "emergencyContact1TelephoneNumber",
    "emergencyContact1AlternativeTelephoneNumber",
    "emergencyContact2FullName",
    "emergencyContact2TelephoneNumber",
    "emergencyContact2AlternativeTelephoneNumber",
    "emergencyContact3FullName",
    "emergencyContact3TelephoneNumber",
    "emergencyContact3AlternativeTelephoneNumber"
  );
  const pageHeading = "Add emergency contact information for up to 3 people";
  const errors = FormValidator.errorSummary(formData);
  const {
    emergencyContact1FullName,
    emergencyContact1TelephoneNumber,
  } = FormValidator.validate(formData);
  const pageHasErrors = needsValidation && FormValidator.hasErrors(formData);

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/beacon-owner-address" />
        }
        title={pageHeading}
        pageHasErrors={pageHasErrors}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/emergency-contact">
                <FormFieldset>
                  <FormErrorSummary
                    showErrorSummary={needsValidation}
                    errors={errors}
                  />
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
                    fullName={formData.emergencyContact1FullName}
                    telephoneNumber={formData.emergencyContact1TelephoneNumber}
                    alternativeTelephoneNumber={
                      formData.emergencyContact1AlternativeTelephoneNumber
                    }
                    fullNameErrors={
                      pageHasErrors && emergencyContact1FullName.invalid
                    }
                    fullNameErrorMessages={
                      emergencyContact1FullName.errorMessages
                    }
                    telephoneNumberErrors={
                      pageHasErrors && emergencyContact1TelephoneNumber.invalid
                    }
                    telephoneNumberErrorMessages={
                      emergencyContact1TelephoneNumber.errorMessages
                    }
                  />

                  <EmergencyContactGroup
                    index="2"
                    fullName={formData.emergencyContact1FullName}
                    telephoneNumber={formData.emergencyContact1TelephoneNumber}
                    alternativeTelephoneNumber={
                      formData.emergencyContact1AlternativeTelephoneNumber
                    }
                  />

                  <EmergencyContactGroup
                    index="3"
                    fullName={formData.emergencyContact1FullName}
                    telephoneNumber={formData.emergencyContact1TelephoneNumber}
                    alternativeTelephoneNumber={
                      formData.emergencyContact1AlternativeTelephoneNumber
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
  fullNameErrors,
  fullNameErrorMessages,
  telephoneNumberErrors,
  telephoneNumberErrorMessages,
}: EmergencyContactGroupProps): JSX.Element => (
  <>
    <FormLegend className="govuk-fieldset__legend--m">
      Emergency contact {index}
      {index == "1" ? "" : " (optional)"}
    </FormLegend>
    <FormGroup
      showErrors={fullNameErrors}
      errorMessages={fullNameErrorMessages}
    >
      <Input
        id={"emergencyContact" + index + "FullName"}
        label={
          "Emergency contact's full name" + (index == "1" ? "" : " (optional)")
        }
        defaultValue={fullName}
      />
    </FormGroup>
    <FormGroup
      showErrors={telephoneNumberErrors}
      errorMessages={telephoneNumberErrorMessages}
    >
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

export const getServerSideProps: GetServerSideProps = handlePageRequest("/");

export default EmergencyContact;
