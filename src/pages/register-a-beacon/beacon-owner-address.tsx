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
import { GovUKBody } from "../../components/Typography";
import { FormValidator } from "../../lib/formValidator";
import { FormPageProps, handlePageRequest } from "../../lib/handlePageRequest";
import { ensureFormDataHasKeys } from "../../lib/utils";

interface BuildingNumberAndStreetInputProps {
  valueLine1: string;
  valueLine2: string;
  showErrors: boolean;
  errorMessages: string[];
}

const BeaconOwnerAddressPage: FunctionComponent<FormPageProps> = ({
  formData,
  needsValidation,
}: FormPageProps): JSX.Element => {
  formData = ensureFormDataHasKeys(
    formData,
    "beaconOwnerAddressLine1",
    "beaconOwnerAddressLine2",
    "beaconOwnerTownOrCity",
    "beaconOwnerCounty"
  );
  const pageHeading = "What is the beacon owner's address?";
  const errors = FormValidator.errorSummary(formData);
  const {
    beaconOwnerAddressLine1,
    beaconOwnerTownOrCity,
  } = FormValidator.validate(formData);
  const pageHasErrors = needsValidation && FormValidator.hasErrors(formData);

  return (
    <Layout
      navigation={<BackButton href="/register-a-beacon/about-beacon-owner" />}
      title={pageHeading}
      pageHasErrors={pageHasErrors}
    >
      <Grid
        mainContent={
          <>
            <Form action="/register-a-beacon/beacon-owner-address">
              <FormFieldset>
                <FormErrorSummary
                  needsValidation={needsValidation}
                  errors={errors}
                />
                <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                <GovUKBody>
                  The beacon registration certificate and proof of registration
                  labels to stick to the beacon will be sent to this address
                </GovUKBody>
                <BuildingNumberAndStreetInput
                  valueLine1={formData.beaconOwnerAddressLine1}
                  valueLine2={formData.beaconOwnerAddressLine2}
                  showErrors={pageHasErrors}
                  errorMessages={beaconOwnerAddressLine1.errorMessages}
                />
                <TownOrCityInput
                  value={formData.beaconOwnerTownOrCity}
                  showErrors={pageHasErrors}
                  errorMessages={beaconOwnerTownOrCity.errorMessages}
                />
                <CountyInput value={formData.beaconOwnerCounty} />
              </FormFieldset>

              <Button buttonText="Continue" />
              <IfYouNeedHelp />
            </Form>
          </>
        }
      />
    </Layout>
  );
};

const BuildingNumberAndStreetInput: FunctionComponent<BuildingNumberAndStreetInputProps> = ({
  valueLine1 = "",
  valueLine2 = "",
  showErrors,
  errorMessages,
}: BuildingNumberAndStreetInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="beaconOwnerAddressLine1"
      label="Building number and street"
      defaultValue={valueLine1}
    />
    <Input
      id="beaconOwnerAddressLine2"
      label={null}
      defaultValue={valueLine2}
    />
  </FormGroup>
);

const TownOrCityInput: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="beaconOwnerTownOrCity"
      label="Town or city"
      defaultValue={value}
    />
  </FormGroup>
);

const CountyInput: FunctionComponent<FormInputProps> = ({
  value = "",
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={null} errorMessages={null}>
    <Input
      id="beaconOwnerCounty"
      label="County (optional)"
      defaultValue={value}
    />
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = handlePageRequest(
  "/register-a-beacon/emergency-contact"
);

export default BeaconOwnerAddressPage;
