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
import { ErrorSummary } from "../../components/ErrorSummary";
import { FieldValidator } from "../../lib/fieldValidator";

interface CheckBeaconDetailsProps {
  manufacturer: string;
  model: string;
  hexId: string;
  needsValidation: boolean;
}

interface FormInputProps {
  value: string;
  isError: boolean;
  errorMessages: Array<string>;
}

interface ErrorMessageProps {
  id: string;
  message: string;
}

const manufacturerField = new FieldValidator("manufacturer");

manufacturerField
  .should()
  .containANonEmptyString()
  .withErrorMessage("Manufacturer should not be empty");

const modelField = new FieldValidator("model");

modelField
  .should()
  .containANonEmptyString()
  .withErrorMessage("Model should not be empty");

const hexIdField = new FieldValidator("hexId");

hexIdField
  .should()
  .containANonEmptyString()
  .withErrorMessage("HEX ID should not be empty");

hexIdField
  .should()
  .beExactly15Characters()
  .withErrorMessage("HEX ID should be 15 characters long");

const CheckBeaconDetails: FunctionComponent<CheckBeaconDetailsProps> = ({
  manufacturer,
  model,
  hexId,
  needsValidation = false,
}: CheckBeaconDetailsProps): JSX.Element => {
  manufacturerField.value = manufacturer;
  modelField.value = model;
  hexIdField.value = hexId;

  return (
    <>
      <Layout navigation={<BackButton href="/" />}>
        <Grid
          mainContent={
            <>
              {needsValidation &&
                (manufacturerField.hasError() ||
                  modelField.hasError() ||
                  hexIdField.hasError()) && (
                  <ErrorSummaryComponent
                    validators={[manufacturerField, modelField, hexIdField]}
                  />
                )}
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
                    value={manufacturer}
                    isError={needsValidation && manufacturerField.hasError()}
                    errorMessages={manufacturerField.errorMessages()}
                  />

                  <BeaconModelInput
                    value={model}
                    isError={needsValidation && modelField.hasError()}
                    errorMessages={modelField.errorMessages()}
                  />

                  <BeaconHexIdInput
                    value={hexId}
                    isError={needsValidation && hexIdField.hasError()}
                    errorMessages={hexIdField.errorMessages()}
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

interface ErrorSummaryComponentProps {
  validators: FieldValidator[];
}

const ErrorSummaryComponent: FunctionComponent<ErrorSummaryComponentProps> = ({
  validators,
}: ErrorSummaryComponentProps) => (
  <>
    {validators && (
      <ErrorSummary>
        {validators.map((validator, validatorIndex) => {
          return validator.errorMessages().map((errorMessage, errorIndex) => {
            return (
              <li key={`${validator.fieldId}-${validatorIndex}-${errorIndex}`}>
                {/*TODO: href should go to the component error message, e.g. `hexId-error-0`*/}
                <a href={`#${validator.fieldId}`}>{errorMessage}</a>
              </li>
            );
          });
        })}
      </ErrorSummary>
    )}
  </>
);

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
  isError,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup hasError={isError}>
    <FormLabel htmlFor="manufacturer">Enter your beacon manufacturer</FormLabel>
    {isError &&
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
  isError,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup hasError={isError}>
    <FormLabel htmlFor="model">Enter your beacon model</FormLabel>
    {isError &&
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
  isError,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup hasError={isError}>
    <FormLabel htmlFor="hexId">Enter the 15 digit beacon HEX ID</FormLabel>
    {isError &&
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
    if (context.req.method === "POST") {
      const formData: BeaconCacheEntry = await updateFormCache(context);

      manufacturerField.value = formData.manufacturer;
      modelField.value = formData.model;
      hexIdField.value = formData.hexId;

      if (
        manufacturerField.hasError() ||
        modelField.hasError() ||
        hexIdField.hasError()
      ) {
        return {
          props: {
            needsValidation: true,
            manufacturer: formData.manufacturer,
            model: formData.model,
            hexId: formData.hexId,
          },
        };
      } else {
        return {
          redirect: {
            destination: "/register-a-beacon/beacon-information",
            permanent: false,
          },
        };
      }
    }

    const formData: BeaconCacheEntry = getCache(context);

    return {
      props: {
        needsValidation: false,
        ...formData,
      },
    };
  }
);

export default CheckBeaconDetails;
