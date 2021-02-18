import React, { FunctionComponent } from "react";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { Button, BackButton } from "../../components/Button";
import {
  Form,
  FormFieldset,
  Input,
  FormLegendPageHeading,
  FormLabel,
  FormGroup,
  FormHint,
} from "../../components/Form";
import { Details } from "../../components/Details";
import { IfYouNeedHelp } from "../../components/Mca";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { BeaconCacheEntry } from "../../lib/formCache";
import { updateFormCache, withCookieRedirect } from "../../lib/middleware";
import {
  FormErrorSummary,
  FieldErrorList,
} from "../../components/ErrorSummary";

import { FormValidator } from "../../lib/formValidator";
import { Beacon } from "../../lib/types";

interface CheckBeaconDetailsProps {
  formData: Partial<Beacon>;
  needsValidation: boolean;
}

interface FormInputProps {
  value: string;
  errorMessages: string[];
  showErrors: boolean;
}

const CheckBeaconDetails: FunctionComponent<CheckBeaconDetailsProps> = ({
  formData,
  needsValidation = false,
}: CheckBeaconDetailsProps): JSX.Element => {
  ensureFormDataHasKeys(formData, "manufacturer", "model", "hexId");

  const errors = FormValidator.errorSummary(formData);

  const { manufacturer, model, hexId } = FormValidator.validate(formData);

  return (
    <>
      <Layout navigation={<BackButton href="/" />}>
        <Grid
          mainContent={
            <>
              {needsValidation && <FormErrorSummary errors={errors} />}
              <Form action="/register-a-beacon/check-beacon-details">
                <FormFieldset>
                  <FormLegendPageHeading>
                    Check beacon details
                  </FormLegendPageHeading>
                  <InsetText>
                    The details of your beacon must be checked to ensure they
                    have a UK encoding and if they are already registered with
                    this service.
                  </InsetText>

                  <BeaconManufacturerInput
                    value={manufacturer.value}
                    showErrors={needsValidation && manufacturer.invalid}
                    errorMessages={manufacturer.errors}
                  />

                  <BeaconModelInput
                    value={model.value}
                    showErrors={needsValidation && model.invalid}
                    errorMessages={model.errors}
                  />

                  <BeaconHexIdInput
                    value={hexId.value}
                    showErrors={needsValidation && hexId.invalid}
                    errorMessages={hexId.errors}
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

const BeaconManufacturerInput: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors}>
    <FormLabel htmlFor="manufacturer">Enter your beacon manufacturer</FormLabel>
    {showErrors && (
      <FieldErrorList href="#manufacturer" errorMessages={errorMessages} />
    )}
    <Input name="manufacturer" id="manufacturer" defaultValue={value} />
  </FormGroup>
);

const BeaconModelInput: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors}>
    <FormLabel htmlFor="model">Enter your beacon model</FormLabel>
    {showErrors && (
      <FieldErrorList href="#model" errorMessages={errorMessages} />
    )}
    <Input name="model" id="model" defaultValue={value} />
  </FormGroup>
);

const BeaconHexIdInput: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors}>
    <FormLabel htmlFor="hexId">Enter the 15 digit beacon HEX ID</FormLabel>
    {showErrors && (
      <FieldErrorList href="#hexId" errorMessages={errorMessages} />
    )}
    <FormHint forId="hexId">
      This will be on your beacon. It must be 15 characters long and use
      characters 0-9, A-F
    </FormHint>
    <Input
      name="hexId"
      id="hexId"
      htmlAttributes={{ spellCheck: false }}
      defaultValue={value}
    />
    <Details
      summaryText="What does the 15 digit beacon HEX ID look like?"
      className="govuk-!-padding-top-2"
    >
      TODO: Explain to users how to find their beacon HEX ID
    </Details>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    const formData: BeaconCacheEntry = await updateFormCache(context);

    const userDidSubmitForm = context.req.method === "POST";
    const formIsValid = !FormValidator.hasErrors(formData);

    if (userDidSubmitForm && formIsValid) {
      return {
        // TODO Make this a GET request with status code 30X
        redirect: {
          destination: "/register-a-beacon/beacon-information",
          permanent: false,
        },
      };
    }

    return {
      props: {
        formData,
        needsValidation: userDidSubmitForm,
      },
    };
  }
);

const ensureFormDataHasKeys = (formData, ...keys) => {
  keys.forEach((key: string) => {
    if (!formData[key]) {
      formData[key] = "";
    }
  });

  return formData;
};

export default CheckBeaconDetails;
