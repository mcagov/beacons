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
import {
  getCache,
  updateFormCache,
  withCookieRedirect,
} from "../../lib/middleware";
import { ErrorSummary, FormErrorSummary } from "../../components/ErrorSummary";
import {
  BeaconHexIdValidator,
  BeaconManufacturerValidator,
  BeaconModelValidator,
  FieldValidators,
} from "../../lib/fieldValidators";
import { FormValidator, IFormError } from "../../lib/formValidator";
import { Beacon } from "../../lib/types";

interface CheckBeaconDetailsProps {
  formData: Partial<Beacon>;
  needsValidation: boolean;
}

interface FormInputProps {
  value: string;
  valid: boolean;
  errorMessages: Array<string>;
}

interface ErrorMessageProps {
  id: string;
  message: string;
}

// TODO: Encapsulate `new`s into a factory function/functions
const formValidator = new FormValidator();

const beaconDetailsFormDictionary = {
  manufacturer: new BeaconManufacturerValidator(),
  model: new BeaconModelValidator(),
  hexId: new BeaconHexIdValidator(),
};

const CheckBeaconDetails: FunctionComponent<CheckBeaconDetailsProps> = ({
  formData,
  needsValidation = false,
}: CheckBeaconDetailsProps): JSX.Element => {
  const errors = formValidator.errorSummary(
    beaconDetailsFormDictionary,
    formData
  );

  const { manufacturer, model, hexId } = formValidator.validate(
    beaconDetailsFormDictionary,
    formData
  );

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
                    valid={needsValidation && manufacturer.valid}
                    errorMessages={manufacturer.errors}
                  />

                  <BeaconModelInput
                    value={model.value}
                    valid={needsValidation && model.valid}
                    errorMessages={model.errors}
                  />

                  <BeaconHexIdInput
                    value={hexId.value}
                    valid={needsValidation && hexId.valid}
                    errorMessages={hexId.errors}
                  />
                </FormFieldset>
                <Button buttonText="Submit" />
              </Form>
              <IfYouNeedHelp />
            </>
          }
        />
      </Layout>
    </>
  );
};

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({
  id,
  message,
}: ErrorMessageProps) => (
  <span id={id} className="govuk-error-message">
    <span className="govuk-visually-hidden">Error:</span> {message}
  </span>
);

const BeaconManufacturerInput: FunctionComponent<FormInputProps> = ({
  value = "",
  valid,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup hasError={!valid}>
    <FormLabel htmlFor="manufacturer">Enter your beacon manufacturer</FormLabel>
    {!valid &&
      errorMessages.map((message, index) => (
        <ErrorMessage
          id={`manufacturer-error-${index}`}
          key={`manufacturer-error-${index}`}
          message={message}
        />
      ))}
    <Input name="manufacturer" id="manufacturer" defaultValue={value} />
  </FormGroup>
);

const BeaconModelInput: FunctionComponent<FormInputProps> = ({
  value = "",
  valid,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup hasError={!valid}>
    <FormLabel htmlFor="model">Enter your beacon model</FormLabel>
    {!valid &&
      errorMessages.map((message, index) => (
        <ErrorMessage
          id={`model-error-${index}`}
          key={`model-error-${index}`}
          message={message}
        />
      ))}
    <Input name="model" id="model" defaultValue={value} />
  </FormGroup>
);

const BeaconHexIdInput: FunctionComponent<FormInputProps> = ({
  value = "",
  valid,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup hasError={!valid}>
    <FormLabel htmlFor="hexId">Enter the 15 digit beacon HEX ID</FormLabel>
    {!valid &&
      errorMessages.map((message, index) => (
        <ErrorMessage
          id={`hexId-error-${index}`}
          key={`hexId-error-${index}`}
          message={message}
        />
      ))}
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
    const formIsValid = formValidator.hasErrors(
      beaconDetailsFormDictionary,
      formData
    );

    if (userDidSubmitForm && formIsValid) {
      if (formValidator.hasErrors(beaconDetailsFormDictionary, formData)) {
        return {
          // TODO Make this a GET request with status code 30X
          redirect: {
            destination: "/register-a-beacon/beacon-information",
            permanent: false,
          },
        };
      }
    }

    return {
      props: {
        formData: formData,
        needsValidation: userDidSubmitForm,
      },
    };
  }
);

export default CheckBeaconDetails;
