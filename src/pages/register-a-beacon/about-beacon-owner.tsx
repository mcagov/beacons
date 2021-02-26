import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { FormInputProps, Input } from "../../components/Input";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { FormValidator } from "../../lib/formValidator";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { ensureFormDataHasKeys } from "../../lib/utils";

const AboutBeaconOwner: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
  showCookieBanner,
}: FormPageProps): JSX.Element => {
  formData = ensureFormDataHasKeys(
    formData,
    "beaconOwnerFullName",
    "beaconOwnerTelephoneNumber",
    "beaconOwnerAlternativeTelephoneNumber",
    "beaconOwnerEmail"
  );
  const pageHeading = "About the beacon owner";
  const errors = FormValidator.errorSummary(formData);
  const { beaconOwnerFullName, beaconOwnerEmail } = FormValidator.validate(
    formData
  );
  const pageHasErrors = needsValidation && FormValidator.hasErrors(formData);

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/more-vessel-details" />
        }
        title={pageHeading}
        pageHasErrors={pageHasErrors}
        showCookieBanner={showCookieBanner}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/about-beacon-owner">
                <FormFieldset>
                  <FormErrorSummary
                    showErrorSummary={needsValidation}
                    errors={errors}
                  />
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <FullName
                    value={formData.beaconOwnerFullName}
                    showErrors={pageHasErrors && beaconOwnerFullName.invalid}
                    errorMessages={beaconOwnerFullName.errorMessages}
                  />

                  <TelephoneNumber
                    value={formData.beaconOwnerTelephoneNumber}
                  />

                  <AlternativeTelephoneNumber
                    value={formData.beaconOwnerAlternativeTelephoneNumber}
                  />

                  <EmailAddress
                    value={formData.beaconOwnerEmail}
                    showErrors={pageHasErrors && beaconOwnerEmail.invalid}
                    errorMessages={beaconOwnerEmail.errorMessages}
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

const FullName: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input id="beaconOwnerFullName" label="Full name" defaultValue={value} />
  </FormGroup>
);

const TelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="beaconOwnerTelephoneNumber"
      label="Telephone number (optional)"
      hintText="This can be a mobile or landline. For international numbers include the country code."
      defaultValue={value}
    />
  </FormGroup>
);

const AlternativeTelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="beaconOwnerAlternativeTelephoneNumber"
      label="Additional telephone number (optional)"
      hintText="This can be a mobile or landline. For international numbers include the country code."
      defaultValue={value}
    />
  </FormGroup>
);

const EmailAddress: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="beaconOwnerEmail"
      label="Email address (optional)"
      hintText="You will receive an email confirming your beacon registration application, including a reference
        number if you need to get in touch with the beacons registry team."
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/beacon-owner-address"
);

export default AboutBeaconOwner;
