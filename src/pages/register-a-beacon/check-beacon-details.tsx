import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { NextApiRequestCookies } from "next/dist/next-server/server/api-utils";
import React, { FunctionComponent } from "react";
import { BackButton, Button } from "../../components/Button";
import { Details } from "../../components/Details";
import { FormErrorSummary } from "../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../components/Form";
import { Grid } from "../../components/Grid";
import { FormInputProps, Input } from "../../components/Input";
import { InsetText } from "../../components/InsetText";
import { Layout } from "../../components/Layout";
import { IfYouNeedHelp } from "../../components/Mca";
import { CacheEntry } from "../../lib/formCache";
import { FormValidator } from "../../lib/formValidator";
import {
  getCache,
  parseFormData,
  updateFormCache,
  withCookieRedirect,
} from "../../lib/middleware";
import { ensureFormDataHasKeys } from "../../lib/utils";

interface CheckBeaconDetailsProps {
  formData: CacheEntry;
  needsValidation?: boolean;
}

const CheckBeaconDetails: FunctionComponent<CheckBeaconDetailsProps> = ({
  formData,
  needsValidation = false,
}: CheckBeaconDetailsProps): JSX.Element => {
  formData = ensureFormDataHasKeys(formData, "manufacturer", "model", "hexId");

  const errors = FormValidator.errorSummary(formData);

  const { manufacturer, model, hexId } = FormValidator.validate(formData);

  const pageHeading = "Check beacon details";

  const pageHasErrors = needsValidation && FormValidator.hasErrors(formData);

  return (
    <>
      <Layout
        navigation={<BackButton href="/" />}
        title={pageHeading}
        pageHasErrors={pageHasErrors}
      >
        <Grid
          mainContent={
            <>
              <FormErrorSummary
                errors={errors}
                needsValidation={needsValidation}
              />
              <Form action="/register-a-beacon/check-beacon-details">
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <InsetText>
                    The details of your beacon must be checked to ensure it is
                    programmed for UK registration.
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
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="manufacturer"
      label="Enter your beacon manufacturer"
      defaultValue={value}
    />
  </FormGroup>
);

const BeaconModelInput: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input id="model" label="Enter your beacon model" defaultValue={value} />
  </FormGroup>
);

const BeaconHexIdInput: FunctionComponent<FormInputProps> = ({
  value = "",
  showErrors,
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup showErrors={showErrors} errorMessages={errorMessages}>
    <Input
      id="hexId"
      label="Enter the 15 character beacon HEX ID or UIN number"
      hintText="This will be on your beacon. It must be 15 characters long and use
      characters 0 to 9 and letters A to F"
      htmlAttributes={{ spellCheck: false }}
      defaultValue={value}
    />
    <Details
      summaryText="What does the 15 character beacon HEX ID or UIN look like?"
      className="govuk-!-padding-top-2"
    >
      TODO: Explain to users how to find their beacon HEX ID
    </Details>
  </FormGroup>
);

export const getServerSideProps: GetServerSideProps = withCookieRedirect(
  async (context: GetServerSidePropsContext) => {
    if (context.req.method === "POST") {
      return handlePostRequest(context);
    } else {
      return handleGetRequest(context.req.cookies);
    }
  }
);

const handlePostRequest = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<CheckBeaconDetailsProps>> => {
  const rawFormData: CacheEntry = await parseFormData(context.req);
  const formData: CacheEntry = {
    ...rawFormData,
    hexId: (rawFormData["hexId"] || "").toUpperCase(),
  };

  updateFormCache(context.req.cookies, formData);

  const formIsValid = !FormValidator.hasErrors(formData);

  if (formIsValid) {
    return {
      redirect: {
        statusCode: 303,
        destination: "/register-a-beacon/beacon-information",
      },
    };
  }

  return {
    props: {
      formData: formData,
      needsValidation: true,
    },
  };
};

const handleGetRequest = (
  cookies: NextApiRequestCookies
): GetServerSidePropsResult<CheckBeaconDetailsProps> => {
  return {
    props: {
      formData: getCache(cookies),
    },
  };
};

export default CheckBeaconDetails;
