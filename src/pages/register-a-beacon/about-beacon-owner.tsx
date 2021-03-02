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
import { FieldManager } from "../../lib/form/fieldManager";
import { FormManager } from "../../lib/form/formManager";
import { Validators } from "../../lib/form/validators";
import { CacheEntry } from "../../lib/formCache";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";

const defineFormRules = ({
  beaconOwnerFullName,
  beaconOwnerTelephoneNumber,
  beaconOwnerAlternativeTelephoneNumber,
  beaconOwnerEmail,
}: CacheEntry): FormManager => {
  return new FormManager({
    beaconOwnerFullName: new FieldManager(beaconOwnerFullName, [
      Validators.required("Full name is a required field"),
    ]),
    beaconOwnerTelephoneNumber: new FieldManager(beaconOwnerTelephoneNumber),
    beaconOwnerAlternativeTelephoneNumber: new FieldManager(
      beaconOwnerAlternativeTelephoneNumber
    ),
    beaconOwnerEmail: new FieldManager(beaconOwnerEmail, [
      Validators.email("Email address must be valid"),
    ]),
  });
};

const AboutBeaconOwner: FunctionComponent<FormPageProps> = ({
  form,
}: FormPageProps): JSX.Element => {
  const pageHeading = "About the beacon owner";

  return (
    <>
      <Layout
        navigation={
          <BackButton href="/register-a-beacon/more-vessel-details" />
        }
        title={pageHeading}
        pageHasErrors={form.hasErrors}
      >
        <Grid
          mainContent={
            <>
              <Form action="/register-a-beacon/about-beacon-owner">
                <FormFieldset>
                  <FormErrorSummary formErrors={form.errorSummary} />
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>

                  <FullName
                    value={form.fields.beaconOwnerFullName.value}
                    errorMessages={
                      form.fields.beaconOwnerFullName.errorMessages
                    }
                  />

                  <TelephoneNumber
                    value={form.fields.beaconOwnerTelephoneNumber.value}
                  />

                  <AlternativeTelephoneNumber
                    value={
                      form.fields.beaconOwnerAlternativeTelephoneNumber.value
                    }
                  />

                  <EmailAddress
                    value={form.fields.beaconOwnerEmail.value}
                    errorMessages={form.fields.beaconOwnerEmail.errorMessages}
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
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="beaconOwnerFullName" label="Full name" defaultValue={value} />
  </FormGroup>
);

const TelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
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
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
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
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
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
  "/register-a-beacon/beacon-owner-address",
  defineFormRules
);

export default AboutBeaconOwner;
