import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { Details } from "../../components/Details";
import {
  FieldErrorList,
  FormErrorSummary,
} from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormHint,
  FormLabel,
  FormLegendPageHeading,
  Input,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { BeaconCacheEntry } from "../../lib/formCache";
import { FormValidator } from "../../lib/formValidator";
import { updateFormCache, withCookieRedirect } from "../../lib/middleware";
import { ensureFormDataHasKeys } from "../../lib/utils";

interface CheckBeaconDetailsProps {
  formData: BeaconCacheEntry;
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
  formData = ensureFormDataHasKeys(formData, "manufacturer", "model", "hexId");

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
                    value={formData.manufacturer}
                    showErrors={needsValidation && manufacturer.invalid}
                    errorMessages={manufacturer.errorMessages}
                  />

                  <BeaconModelInput
                    value={formData.model}
                    showErrors={needsValidation && model.invalid}
                    errorMessages={model.errorMessages}
                  />

                  <BeaconHexIdInput
                    value={formData.hexId}
                    showErrors={needsValidation && hexId.invalid}
                    errorMessages={hexId.errorMessages}
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
    {showErrors && <FieldErrorList errorMessages={errorMessages} />}
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
    {showErrors && <FieldErrorList errorMessages={errorMessages} />}
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
    {showErrors && <FieldErrorList errorMessages={errorMessages} />}
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
        redirect: {
          statusCode: 303,
          destination: "/register-a-beacon/beacon-information",
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

export default CheckBeaconDetails;
